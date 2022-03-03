import createDataContext from './createDataContext';
import estateApi from '../api/estate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
   switch (action.type) {
      case 'add_error':
         return { ...state, errMessage: action.payload };
      case 'signin':
         return { errMessage: '', token: action.payload };
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
   async ({ fullname, email, password }) => {
      try {
         const response = await estateApi.post('/signup', {
            fullname,
            email,
            password,
         });
         console.log(response.data);
         await AsyncStorage.setItem('token', response.data.token);
         dispatch({ type: 'signin', payload: response.data.token });

         //navigate to main flow
         navigate('mainFlow');
      } catch (err) {
         dispatch({
            type: 'add_error',
            payload: 'Email đã tồn tại',
         });
      }
   };

const signin =
   (dispatch) =>
   async ({ email, password }) => {
      try {
         const response = await estateApi.post('/signin', { email, password });
         await AsyncStorage.setItem('token', response.data.token);
         dispatch({ type: 'signin', payload: response.data.token });
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
   dispatch({ type: 'signout' });
   navigate('loginFlow');
};

export const { Provider, Context } = createDataContext(
   authReducer,
   { signup, signin, signout, clearErrMessage, tryLocalSignin },
   { token: null, errMessage: '' }
);
