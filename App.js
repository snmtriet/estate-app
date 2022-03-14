import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import EstateCreateScreen from './src/screens/EstateCreateScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import EstateListScreen from './src/screens/EstateListScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from './src/navigationRef';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const switchNavigator = createSwitchNavigator({
   ResolveAuth: ResolveAuthScreen,
   loginFlow: createStackNavigator({
      Signin: {
         screen: SigninScreen,
         navigationOptions: {
            headerShown: false,
         },
      },
      Signup: {
         screen: SignupScreen,
         navigationOptions: {
            headerShown: false,
         },
      },
   }),
   mainFlow: createBottomTabNavigator({
      List: {
         screen: EstateListScreen,
         navigationOptions: {
            tabBarLabel: 'List Estate',
            tabBarOptions: {
               activeTintColor: '#18181b',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <Ionicons
                     name="md-home"
                     size={24}
                     color={tabInfo.focused ? '#18181b' : '#8e8e93'}
                  />
               );
            },
         },
      },
      Create: {
         screen: EstateCreateScreen,
         navigationOptions: {
            tabBarLabel: 'Quét QR',
            tabBarOptions: {
               activeTintColor: '#18181b',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <AntDesign
                     name="qrcode"
                     size={24}
                     color={tabInfo.focused ? '#18181b' : '#8e8e93'}
                  />
               );
            },
         },
      },
      Account: {
         screen: AccountScreen,
         navigationOptions: {
            tabBarLabel: 'Account',
            tabBarOptions: {
               activeTintColor: '#18181b',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <Ionicons
                     name="md-person-circle-outline"
                     size={24}
                     color={tabInfo.focused ? '#18181b' : '#8e8e93'}
                  />
               );
            },
         },
      },
   }),
   // estateListFlow: createStackNavigator({
   //    Create: EstateCreateScreen,
   // }),
   EstateCreate: EstateCreateScreen,
   AccountFlow: createSwitchNavigator({
      Account: AccountScreen,
      ChangePassword: ChangePasswordScreen,
   }),
});

const App = createAppContainer(switchNavigator);

export default () => {
   return (
      <AuthProvider>
         <App
            ref={(navigator) => {
               setNavigator(navigator);
            }}
         />
      </AuthProvider>
   );
};
