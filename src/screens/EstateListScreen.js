import React from 'react';
import { StyleSheet } from 'react-native';
import {
   FormControl,
   Input,
   Stack,
   WarningOutlineIcon,
   Box,
   Center,
   NativeBaseProvider,
   Button,
} from 'native-base';

const EstateListScreen = () => {
   return (
      <Box alignItems="center">
         <Box w="80%" maxWidth="300px" minWidth="300px">
            <FormControl isRequired>
               <Stack mx="4">
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                     w="100%"
                     type="password"
                     defaultValue="12345"
                     placeholder="password"
                  />
                  <FormControl.HelperText>
                     Must be atleast 6 characters.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                     leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                     Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                  <Button onPress={() => console.log('hello world')}>
                     Click Me
                  </Button>
               </Stack>
            </FormControl>
         </Box>
      </Box>
   );
};

const styles = StyleSheet.create({});

export default () => {
   return (
      <NativeBaseProvider>
         <Center flex={1} px="3">
            <EstateListScreen />
         </Center>
      </NativeBaseProvider>
   );
};
