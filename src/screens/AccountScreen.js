import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
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

import { Context as AuthContext } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import Avatar1 from '../../assets/img/1dc27997938b5cd5059a9.jpg';
import Avatar2 from '../../assets/img/27c271699a75552b0c6412.jpg';
import Avatar3 from '../../assets/img/2f81992a7236bd68e42713.jpg';
import Avatar4 from '../../assets/img/6b61bde356ff99a1c0ee14.jpg';
import Avatar5 from '../../assets/img/8fc4a361487d8723de6c11.jpg';
import Avatar6 from '../../assets/img/938c7830932c5c72053d10.jpg';
import Avatar7 from '../../assets/img/940fb0845b9894c6cd8916.jpg';
import Avatar8 from '../../assets/img/c97598f273eebcb0e5ff15.jpg';

const listImage = [
   Avatar1,
   Avatar2,
   Avatar3,
   Avatar4,
   Avatar5,
   Avatar6,
   Avatar7,
   Avatar8,
];

const AccountScreen = ({ navigation }) => {
   const { signout, clearErrMessage } = useContext(AuthContext);
   const [name, setName] = useState('');
   const randomIndex = Math.floor(Math.random() * listImage.length);
   const [avatarRandom, setAvatarRandom] = useState(listImage[randomIndex]);

   const handleSignout = async () => {
      await AsyncStorage.removeItem('dataScanned');
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.removeItem('dataUnScanned');
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
                  <Avatar size="lg" bg="green.500" source={avatarRandom}>
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
