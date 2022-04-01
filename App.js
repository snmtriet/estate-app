import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import EstateCreateScreen from './src/screens/EstateCreateScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import EstateInventoryScreen from './src/screens/EstateInventoryScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from './src/navigationRef';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import ChangeInfoScreen from './src/screens/ChangeInfoScreen ';

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
         screen: EstateInventoryScreen,
         navigationOptions: {
            tabBarLabel: 'Inventories',
            tabBarOptions: {
               activeTintColor: '#18181b',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <MaterialIcons
                     name="inventory"
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
   EstateCreate: EstateCreateScreen,
   AccountFlow: createSwitchNavigator({
      Account: AccountScreen,
      ChangePassword: ChangePasswordScreen,
      ChangeInfo: ChangeInfoScreen,
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
