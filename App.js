import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import EstateCreateScreen from './src/screens/EstateCreateScreen';
import EstateDetailScreen from './src/screens/EstateDetailScreen';
import EstateListScreen from './src/screens/EstateListScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from './src/navigationRef';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const switchNavigator = createSwitchNavigator({
   ResolveAuth: ResolveAuthScreen,
   loginFlow: createStackNavigator({
      Signin: SigninScreen,
      Signup: SignupScreen,
   }),
   mainFlow: createBottomTabNavigator({
      Create: {
         screen: EstateCreateScreen,
         navigationOptions: {
            tabBarLabel: 'Create Estate',
            tabBarOptions: {
               activeTintColor: '#0891b2',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <Feather
                     name="plus-circle"
                     size={24}
                     color={tabInfo.focused ? '#0891b2' : '#8e8e93'}
                  />
               );
            },
         },
      },
      List: {
         screen: EstateListScreen,
         navigationOptions: {
            tabBarLabel: 'List Estate',
            tabBarOptions: {
               activeTintColor: '#0891b2',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <Ionicons
                     name="md-home"
                     size={24}
                     color={tabInfo.focused ? '#0891b2' : '#8e8e93'}
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
               activeTintColor: '#0891b2',
            },
            tabBarIcon: (tabInfo) => {
               return (
                  <Ionicons
                     name="md-person-circle-outline"
                     size={24}
                     color={tabInfo.focused ? '#0891b2' : '#8e8e93'}
                  />
               );
            },
         },
      },
   }),
   estateListFlow: createStackNavigator({
      Create: EstateCreateScreen,
      EstateDetail: EstateDetailScreen,
   }),
   EstateCreate: EstateCreateScreen,
   Account: AccountScreen,
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
