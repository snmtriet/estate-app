import createDataContext from './createDataContext';
import estateApi from '../api/estate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigationRef';
import { FACULTY_ID } from '@env';

const authReducer = (state, action) => {
   switch (action.type) {
      case 'add_error':
         return { ...state, errMessage: action.payload };
      case 'add_error_changepassword':
         return {
            ...state,
            successMessageChangePassword: '',
            errMessageChangePassword: action.payload,
         };
      case 'add_success_changepassword':
         return {
            ...state,
            errMessageChangePassword: '',
            successMessageChangePassword: action.payload,
         };
      case 'add_success_updateMe':
         return {
            ...state,
            successMessageUpdateMe: action.payload,
            errMessageUpdateMe: '',
         };
      case 'add_error_updateMe':
         return {
            ...state,
            successMessageUpdateMe: '',
            errMessageUpdateMe: action.payload,
         };
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
         return {
            ...state,
            errMessage: '',
            successMessageChangePassword: '',
            successMessageUpdateMe: '',
            errMessageUpdateMe: '',
         };
      case 'dataScanned':
         return { ...state, dataScanned: action.payload };
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
      navigate('loginFlow');
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
            faculty: FACULTY_ID,
            password,
            passwordConfirm,
         });
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
   // await AsyncStorage.removeItem('savedIds');
   await AsyncStorage.removeItem('currentUser');
   dispatch({ type: 'signout' });
   navigate('loginFlow');
};

//unique array data
const onlyUnique = (value, index, self) => {
   return self.indexOf(value) === index;
};

const exportToExcel = (dispatch) => async () => {
   const token = await AsyncStorage.getItem('token');
   const arrIds = await AsyncStorage.getItem('saveIdsCategory');
   const user = await AsyncStorage.getItem('currentUser');
   const objIds = JSON.parse([arrIds]);
   const uniqueObjIds = objIds.filter(onlyUnique);

   //loop && find category by Id
   let categoriesArr = Promise.all(
      uniqueObjIds.map(async (categoryId) => {
         let category = await estateApi.get(`/categories/${categoryId}`);
         category = { ...category.data.data.category };
         return category;
      })
   );
   categoriesArr.then(async (data) => {
      // export
      if (uniqueObjIds) {
         await estateApi
            .post(
               '/inventories',
               {
                  user,
                  checkList: data,
               },
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            )
            .then(async (response) => {
               await AsyncStorage.removeItem('saveIdsCategory');
               await AsyncStorage.removeItem('dataScanned');
            })
            .catch((err) => console.log(err.response.data.message));
      }
   });
};

const changePassword =
   (dispatch) =>
   async ({ currentPassword, newPassword, newPasswordConfirm }) => {
      const token = await AsyncStorage.getItem('token');
      try {
         const response = await estateApi.patch(
            '/users/updateMyPassword',
            {
               passwordCurrent: currentPassword,
               password: newPassword,
               passwordConfirm: newPasswordConfirm,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         dispatch({
            type: 'add_success_changepassword',
            payload: 'Change password success',
         });
         // navigate('mainFlow');
      } catch (error) {
         if (error.response) {
            // Request made and server responded
            console.log('error data: ', error.response.data);
            console.log('error status: ', error.response.status);
            // console.log('error headers: ', error.response.headers);
            dispatch({
               type: 'add_error_changepassword',
               payload: error.response.data.message,
            });
         } else if (error.request) {
            // The request was made but no response was received
            // console.log('request: ', error.request);
         } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
         }
      }
   };
const updateMe =
   (dispatch) =>
   async ({ fullname, age, phone }) => {
      // console.log('🍕 ~ fullname, age, phone', fullname, age, phone);
      const token = await AsyncStorage.getItem('token');
      var params;
      if (fullname && !age && !phone) {
         params = { fullname };
      } else if (!fullname && age && !phone) {
         params = { age };
      } else if (!fullname && !age && phone) {
         params = { phone };
      } else {
         params = { fullname, age, phone };
      }
      try {
         await estateApi.patch('/users/updateMe', params, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         dispatch({
            type: 'add_success_updateMe',
            payload: 'Change info success',
         });
         if (fullname) {
            await AsyncStorage.setItem('fullname', fullname);
         }
      } catch (error) {
         if (error.response) {
            dispatch({
               type: 'add_error_updateMe',
               payload: error.response.data.message,
            });
         }
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
      exportToExcel,
      changePassword,
      updateMe,
   },
   { token: null, errMessage: '', successMessage: '' }
);
