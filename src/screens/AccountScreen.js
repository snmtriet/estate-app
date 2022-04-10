import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import {
   Stack,
   Text,
   VStack,
   Center,
   NativeBaseProvider,
   Avatar,
   Flex,
} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
   MaterialIcons,
   MaterialCommunityIcons,
   Entypo,
} from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import NavLink from '../components/NavLink';

const AccountScreen = ({ navigation }) => {
   const { signout, clearErrMessage } = useContext(AuthContext);
   const [name, setName] = useState('');

   const handleSignout = async () => {
      await AsyncStorage.removeItem('dataScanned');
      await AsyncStorage.removeItem('currentUser');
      signout();
   };

   useEffect(async () => {
      await AsyncStorage.getItem('fullname').then((data) => {
         setName(data);

         return async () => {
            await AsyncStorage.removeItem('fullname');
         };
      });
   }, []);
   return (
      <Flex bg="#F2F2F2" direction="row" flex={1}>
         <NavigationEvents onWillBlur={clearErrMessage} />
         <VStack space={'1'} alignItems="center" mt={10}>
            <Stack
               direction="row"
               h="20"
               bg="blueGray.50"
               rounded="xs"
               pl="5"
               minWidth="800"
               flex={1}
            >
               <Center mr={'6'}>
                  <Avatar
                     size="lg"
                     bg="green.500"
                     source={require('../../assets/img/1dc27997938b5cd5059a9.jpg')}
                  >
                     null
                  </Avatar>
               </Center>
               <Center>
                  <Text fontSize="lg" color="#18181b">
                     {name}
                  </Text>
               </Center>
            </Stack>

            <Stack
               direction="row"
               h="20"
               bg="blueGray.50"
               rounded="xs"
               pl="5"
               minWidth="800"
               flex={1}
            >
               <Center mr="2">
                  <MaterialCommunityIcons
                     name="information-outline"
                     size={30}
                     color="#18181b"
                  />
               </Center>
               <Center ml="2">
                  <Center ml="2">
                     <NavLink routeName="ChangeInfo" text="Thông tin cá nhân" />
                  </Center>
               </Center>
            </Stack>
            <Stack
               direction="row"
               h="20"
               bg="blueGray.50"
               rounded="xs"
               pl="5"
               minWidth="800"
               flex={1}
            >
               <Center mr="2">
                  <MaterialCommunityIcons
                     name="key-change"
                     size={30}
                     color="#18181b"
                  />
               </Center>
               <Center ml="2">
                  <NavLink routeName="ChangePassword" text="Đổi mật khẩu" />
               </Center>
            </Stack>
            <Stack
               direction="row"
               h="20"
               bg="blueGray.50"
               rounded="xs"
               pl="5"
               minWidth="800"
               flex={1}
            >
               <Center mr="2">
                  <Entypo name="controller-stop" size={30} color="#18181b" />
               </Center>
               <Center ml="2">
                  <Text bg="blueGray.50" color="#18181b" fontSize="md">
                     Coming soon
                  </Text>
               </Center>
            </Stack>
            <Stack
               direction="row"
               h="20"
               bg="blueGray.50"
               rounded="xs"
               pl="5"
               minWidth="800"
               flex={1}
            >
               <Center mr="2">
                  <Entypo name="controller-stop" size={30} color="#18181b" />
               </Center>
               <Center ml="2">
                  <Text bg="blueGray.50" color="#18181b" fontSize="md">
                     Coming soon
                  </Text>
               </Center>
            </Stack>
            <Stack
               direction="row"
               h="20"
               bg="blueGray.50"
               rounded="xs"
               pl="5"
               minWidth="800"
               flex={1}
            >
               <Center mr={'2'}>
                  <MaterialIcons name="logout" size={30} color="#18181b" />
               </Center>
               <Center ml="2">
                  <TouchableOpacity onPress={handleSignout}>
                     <Text bg="blueGray.50" color="#18181b" fontSize="md">
                        Đăng xuất
                     </Text>
                  </TouchableOpacity>
               </Center>
            </Stack>
         </VStack>
      </Flex>
   );
};

const styles = StyleSheet.create({});

export default () => {
   return (
      <NativeBaseProvider>
         <AccountScreen />
      </NativeBaseProvider>
   );
};
