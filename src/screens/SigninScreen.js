import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import NavLink from '../components/NavLink';
import { Context } from '../context/AuthContext';
import {
   Box,
   Text,
   Heading,
   VStack,
   FormControl,
   Input,
   Link,
   Button,
   Center,
   NativeBaseProvider,
   Icon,
   Alert,
   HStack,
   WarningOutlineIcon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';

const loginValidationSchema = yup.object().shape({
   email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
   password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
});

const SigninScreen = ({ navigation }) => {
   const { signin, state, clearErrMessage } = useContext(Context);

   return (
      <View style={styles.container}>
         <NavigationEvents onWillBlur={clearErrMessage} />
         <Formik
            validationSchema={loginValidationSchema}
            initialValues={{ email: '', password: '' }}
            onSubmit={signin}
         >
            {({
               handleChange,
               handleBlur,
               handleSubmit,
               values,
               errors,
               isValid,
            }) => (
               <>
                  <Center w="100%">
                     <Box
                        safeArea
                        p="2"
                        py="8"
                        w="90%"
                        maxW={{ base: '350', md: '600', lg: '600' }}
                        minW={{ base: '350', md: '600', lg: '600' }}
                     >
                        <Heading
                           size="lg"
                           fontWeight="600"
                           color="coolGray.800"
                           _dark={{
                              color: 'warmGray.50',
                           }}
                        >
                           Welcome
                        </Heading>
                        <Heading
                           mt="1"
                           _dark={{
                              color: 'warmGray.200',
                           }}
                           color="coolGray.600"
                           fontWeight="medium"
                           size="xs"
                        >
                           Sign in to continue!
                        </Heading>

                        <VStack space={3} mt="5">
                           <FormControl>
                              <FormControl.Label>Email ID</FormControl.Label>
                              <Input
                                 InputLeftElement={
                                    <Icon
                                       as={<MaterialIcons name="email" />}
                                       size={5}
                                       ml="2"
                                       color="muted.400"
                                    />
                                 }
                                 padding={{ base: '2', md: '5' }}
                                 type="email"
                                 defaultValue={values.email}
                                 placeholder="Email"
                                 onChangeText={handleChange('email')}
                                 onBlur={handleBlur('email')}
                                 borderColor={errors.email && 'red.500'}
                              />
                              {errors.email && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.email}
                                    </FormControl.ErrorMessage>
                                 </FormControl>
                              )}
                           </FormControl>
                           <FormControl>
                              <FormControl.Label>Password</FormControl.Label>
                              <Input
                                 InputRightElement={
                                    <Icon
                                       as={
                                          <MaterialIcons name="visibility-off" />
                                       }
                                       size={5}
                                       mr="2"
                                       color="muted.400"
                                    />
                                 }
                                 padding={{ base: '2', md: '5' }}
                                 type="password"
                                 defaultValue={values.password}
                                 placeholder="Password"
                                 onChangeText={handleChange('password')}
                                 onBlur={handleBlur('password')}
                                 secureTextEntry
                                 borderColor={errors.password && 'red.500'}
                              />
                              {errors.password && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.password}
                                    </FormControl.ErrorMessage>
                                 </FormControl>
                              )}
                              {state.errMessage && (
                                 <Alert w="100%" status="error" mt="4">
                                    <VStack space={2} flexShrink={1} w="100%">
                                       <HStack
                                          flexShrink={1}
                                          space={2}
                                          justifyContent="space-between"
                                       >
                                          <HStack space={2} flexShrink={1}>
                                             <Alert.Icon mt="1" />
                                             <Text
                                                fontSize="md"
                                                color="coolGray.800"
                                             >
                                                {state.errMessage}
                                             </Text>
                                          </HStack>
                                       </HStack>
                                    </VStack>
                                 </Alert>
                              )}
                              <Link
                                 _text={{
                                    fontSize: 'xs',
                                    fontWeight: '500',
                                    color: 'indigo.500',
                                 }}
                                 alignSelf="flex-end"
                                 mt="1"
                              >
                                 Forget Password?
                              </Link>
                           </FormControl>

                           <Button
                              mt="2"
                              colorScheme="indigo"
                              onPress={handleSubmit}
                              disabled={!isValid}
                           >
                              Sign in
                           </Button>
                        </VStack>
                     </Box>
                  </Center>
               </>
            )}
         </Formik>
         <NavLink routeName="Signup" text="I'm a new user.  " />
      </View>
   );
};

SigninScreen.navigationOptions = () => {
   return {
      headerShown: false,
   };
};

const styles = StyleSheet.create({});

export default () => {
   return (
      <NativeBaseProvider>
         <Center flex={1} px="3">
            <SigninScreen />
         </Center>
      </NativeBaseProvider>
   );
};
