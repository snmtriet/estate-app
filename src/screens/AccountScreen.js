import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import {
   Box,
   Stack,
   Text,
   VStack,
   Center,
   NativeBaseProvider,
   Avatar,
   Flex,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from 'react-native-elements';
import {
   MaterialIcons,
   MaterialCommunityIcons,
   Entypo,
} from '@expo/vector-icons';

const AccountScreen = () => {
   const { signout } = useContext(AuthContext);
   const [name, setName] = useState('');

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
               <Center mr="2">
                  <MaterialCommunityIcons
                     name="information-outline"
                     size={30}
                     color="#18181b"
                  />
               </Center>
               <Center ml="2">
                  <Text bg="blueGray.50" color="#18181b" fontSize="md">
                     Thông tin cá nhân
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
                     name="key-change"
                     size={30}
                     color="#18181b"
                  />
               </Center>
               <Center ml="2">
                  <Text bg="blueGray.50" color="#18181b" fontSize="md">
                     Đổi mật khẩu
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
               <Center>
                  <Button
                     onPress={signout}
                     title={'Đăng xuất'}
                     buttonStyle={{
                        backgroundColor: '#f8fafc',
                     }}
                     titleStyle={{ color: '#18181b' }}
                  />
               </Center>
            </Stack>
         </VStack>
      </Flex>
   );
};

const styles = StyleSheet.create({
   backCover: {
      position: 'relative',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgb(0, 0, 0)',
   },
});

export default () => {
   return (
      <NativeBaseProvider>
         <AccountScreen />
      </NativeBaseProvider>
   );
};
