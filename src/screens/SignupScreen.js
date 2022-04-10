import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { Context } from '../context/AuthContext';
import * as yup from 'yup';
import NavLink from '../components/NavLink';
import {
   Text,
   Box,
   Heading,
   VStack,
   FormControl,
   Input,
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

const signupValidationSchema = yup.object().shape({
   fullname: yup
      .string()
      .required('Fullname is required')
      .min(6, ({ min }) => `Fullname must be at least ${min} characters`)
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
   email: yup
      .string()
      .email('Please enter valid email')
      .required('Email address is Required'),
   password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
   passwordConfirm: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const SignupScreen = ({ navigation }) => {
   const { signup, state, clearErrMessage } = useContext(Context);

   return (
      <ScrollView
         showsVerticalScrollIndicator={false}
         style={{ width: '100%' }}
      >
         <View style={styles.container}>
            <NavigationEvents onWillBlur={clearErrMessage} />
            <Formik
               validationSchema={signupValidationSchema}
               initialValues={{
                  fullname: '',
                  email: '',
                  password: '',
                  passwordConfirm: '',
               }}
               onSubmit={signup}
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
                     <Center w="100%" mt={{ base: '2', md: '5', lg: '10' }}>
                        <Box
                           safeArea
                           p="2"
                           w="90%"
                           maxW={{ base: '350', md: '450', lg: '600' }}
                           minW={{ base: '350', md: '450', lg: '600' }}
                           py="8"
                        >
                           <Heading
                              size="lg"
                              color="coolGray.800"
                              _dark={{
                                 color: 'warmGray.50',
                              }}
                              fontWeight="semibold"
                           >
                              Welcome
                           </Heading>
                           <Heading
                              mt="1"
                              color="coolGray.600"
                              _dark={{
                                 color: 'warmGray.200',
                              }}
                              fontWeight="medium"
                              size="xs"
                           >
                              Sign up to continue!
                           </Heading>
                           <VStack space={3} mt="5">
                              <FormControl>
                                 <FormControl.Label>Fullname</FormControl.Label>
                                 <Input
                                    InputLeftElement={
                                       <Icon
                                          as={<MaterialIcons name="person" />}
                                          size={5}
                                          ml="2"
                                          color="muted.400"
                                       />
                                    }
                                    padding={{ base: '2', md: '5' }}
                                    type="text"
                                    defaultValue={values.fullname}
                                    placeholder="Ex: Nguyen Van A"
                                    onChangeText={handleChange('fullname')}
                                    onBlur={handleBlur('fullname')}
                                    borderColor={errors.fullname && 'red.500'}
                                 />
                                 {errors.fullname && (
                                    <FormControl isInvalid>
                                       <FormControl.ErrorMessage
                                          leftIcon={
                                             <WarningOutlineIcon size="xs" />
                                          }
                                       >
                                          {errors.fullname}
                                       </FormControl.ErrorMessage>
                                    </FormControl>
                                 )}
                              </FormControl>
                              <FormControl>
                                 <FormControl.Label>Email</FormControl.Label>
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
                                    placeholder="Ex: nva@gmail.com"
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
                              </FormControl>
                              <FormControl>
                                 <FormControl.Label>
                                    Confirm Password
                                 </FormControl.Label>
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
                                    defaultValue={values.passwordConfirm}
                                    placeholder="Confirm password"
                                    onChangeText={handleChange(
                                       'passwordConfirm'
                                    )}
                                    onBlur={handleBlur('passwordConfirm')}
                                    secureTextEntry
                                    borderColor={
                                       errors.passwordConfirm && 'red.500'
                                    }
                                 />
                                 {errors.passwordConfirm && (
                                    <FormControl isInvalid>
                                       <FormControl.ErrorMessage
                                          leftIcon={
                                             <WarningOutlineIcon size="xs" />
                                          }
                                       >
                                          {errors.passwordConfirm}
                                       </FormControl.ErrorMessage>
                                    </FormControl>
                                 )}
                                 {state.errMessage && (
                                    <Alert w="100%" status="error" mt="4">
                                       <VStack
                                          space={2}
                                          flexShrink={1}
                                          w="100%"
                                       >
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
                              </FormControl>

                              <Button
                                 mt="2"
                                 colorScheme="indigo"
                                 onPress={handleSubmit}
                                 disabled={!isValid}
                              >
                                 Sign up
                              </Button>
                           </VStack>
                        </Box>
                     </Center>
                  </>
               )}
            </Formik>
            <NavLink routeName="Signin" text="Already have an account?  " />
         </View>
      </ScrollView>
   );
};

SignupScreen.navigationOptions = () => {
   return {
      headerShown: false,
   };
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: 180,
   },
});

export default () => {
   return (
      <NativeBaseProvider>
         <Center flex={1} px="3">
            <SignupScreen />
         </Center>
      </NativeBaseProvider>
   );
};
