import React, { useContext, useEffect } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import { HStack, Spinner, Center, NativeBaseProvider } from 'native-base';

const ResolveAuthScreen = () => {
   const { tryLocalSignin } = useContext(AuthContext);
   useEffect(() => {
      tryLocalSignin();
   }, []);

   return (
      <HStack space={8} justifyContent="center" alignItems="center">
         <Spinner size="lg" />
      </HStack>
   );
};

export default () => {
   return (
      <NativeBaseProvider>
         <Center flex={1} px="3">
            <ResolveAuthScreen />
         </Center>
      </NativeBaseProvider>
   );
};
