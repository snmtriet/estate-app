import createDataContext from './createDataContext';
import estateApi from '../api/estate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
   switch (action.type) {
      case 'add_error':
         return { ...state, successMessage: '', errMessage: action.payload };
      case 'add_success':
         return { ...state, errMessage: '', successMessage: action.payload };
      case 'signin':
         return {
            errMessage: '',
            token: action.payload,
         };
      case 'signup':
         return {
            errMessage: '',
            token: action.payload,
         };
      case 'clear_err_message':
         return { ...state, errMessage: '' };
      case 'signout':
         return { token: null, errMessage: '' };
      default:
         return state;
   }
};

const tryLocalSignin = (dispatch) => async () => {
   const token = await AsyncStorage.getItem('token');
   if (token) {
      dispatch({ type: 'signin', payload: token });
      navigate('mainFlow');
   } else {
      navigate('Signup');
   }
};

const clearErrMessage = (dispatch) => () => {
   dispatch({ type: 'clear_err_message' });
};

const signup =
   (dispatch) =>
   async ({ fullname, email, password, passwordConfirm }) => {
      try {
         const response = await estateApi.post('/users/signup', {
            fullname,
            email,
            password,
            passwordConfirm,
         });
         console.log(response.data);
         await AsyncStorage.setItem('token', response.data.token);
         await AsyncStorage.setItem('currentUser', response.data.data.user._id);
         await AsyncStorage.setItem(
            'fullname',
            response.data.data.user.fullname
         );

         dispatch({ type: 'signup', payload: response.data.token });

         //navigate to main flow
         navigate('mainFlow');
      } catch (err) {
         dispatch({
            type: 'add_error',
            payload: 'Email already exists',
         });
      }
   };

const signin =
   (dispatch) =>
   async ({ email, password }) => {
      try {
         const response = await estateApi.post('/users/signin', {
            email,
            password,
         });
         await AsyncStorage.setItem('token', response.data.token);
         await AsyncStorage.setItem('currentUser', response.data.data.user._id);
         await AsyncStorage.setItem(
            'fullname',
            response.data.data.user.fullname
         );

         navigate('mainFlow');
      } catch (err) {
         console.log(err.message);
         dispatch({
            type: 'add_error',
            payload: 'Invalid email or password!',
         });
      }
   };

const signout = (dispatch) => async () => {
   await AsyncStorage.removeItem('token');
   await AsyncStorage.removeItem('savedIds');
   dispatch({ type: 'signout' });
   navigate('loginFlow');
};

//unique array data
const onlyUnique = (value, index, self) => {
   return self.indexOf(value) === index;
};

const exportToExcel = (dispatch) => async () => {
   const user = await AsyncStorage.getItem('currentUser');
   const token = await AsyncStorage.getItem('token');
   const arrIds = await AsyncStorage.getItem('savedIds');
   if (arrIds) {
      const objIds = JSON.parse([arrIds]);
      const uniqueObjIds = objIds.filter(onlyUnique);
      await estateApi
         .post(
            '/inventory',
            {
               user,
               checkList: uniqueObjIds,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         )
         .then(async (response) => {
            await AsyncStorage.removeItem('savedIds');
            await AsyncStorage.removeItem('dataScanned');
         })
         .catch((err) => console.log(err));
   }
};

const updateEstate =
   (dispatch) =>
   async ({ data, status }) => {
      try {
         await estateApi
            .patch(`/estates/${data}`, {
               status,
            })
            .then(async (res) => {
               await AsyncStorage.getItem('dataScanned', (err, result) => {
                  const estate = [res.data.data.estate];
                  if (result !== null) {
                     var newEstate = JSON.parse(result).concat(estate);
                     AsyncStorage.setItem(
                        'dataScanned',
                        JSON.stringify(newEstate)
                     );
                  } else {
                     AsyncStorage.setItem(
                        'dataScanned',
                        JSON.stringify(estate)
                     );
                  }
               });
            });

         // console.log(await AsyncStorage.getItem('dataScanned'));

         await AsyncStorage.getItem('savedIds', (err, result) => {
            const id = [data];
            if (result !== null) {
               var newIds = JSON.parse(result).concat(id);
               AsyncStorage.setItem('savedIds', JSON.stringify(newIds));
            } else {
               AsyncStorage.setItem('savedIds', JSON.stringify(id));
            }
         });
      } catch (error) {
         console.log(error.message);
      }
   };

export const { Provider, Context } = createDataContext(
   authReducer,
   {
      signup,
      signin,
      signout,
      clearErrMessage,
      tryLocalSignin,
      updateEstate,
      exportToExcel,
   },
   { token: null, errMessage: '', successMessage: '' }
);
