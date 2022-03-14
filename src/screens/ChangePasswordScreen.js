import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { Context } from '../context/AuthContext';
import * as yup from 'yup';
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
import NavLink from '../components/NavLink';

const loginValidationSchema = yup.object().shape({
   currentPassword: yup.string().required('Current password is Required'),
   newPassword: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('New password is required'),
   newPasswordConfirm: yup
      .string()
      .required('Confirm new password is required')
      .oneOf([yup.ref('newPassword'), null], 'New passwords must match'),
});

const ChangePasswordScreen = ({ navigation }) => {
   const { changePassword, state } = useContext(Context);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showErr, setShowErr] = useState(false);

   useEffect(() => {
      if (state.errMessageChangePassword) {
         setShowSuccess(false);
         setShowErr(true);
      }
      if (state.successMessageChangePassword) {
         setShowErr(false);
         setShowSuccess(true);
      }
   }, [state.errMessageChangePassword, state.successMessageChangePassword]);

   // clear show message
   // useEffect(() => {
   //    const x = setTimeout(() => {
   //       setShowErr(false);
   //    }, 5000);

   //    return () => {
   //       clearTimeout(x);
   //    };
   // });

   return (
      <View style={styles.container}>
         <Formik
            validationSchema={loginValidationSchema}
            initialValues={{
               currentPassword: '',
               newPassword: '',
               newPasswordConfirm: '',
            }}
            onSubmit={changePassword}
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
                  <Center w="100%" mt={40}>
                     <Box
                        safeArea
                        p="2"
                        w="90%"
                        maxW={{ base: '350', md: '450', lg: '600' }}
                        minW={{ base: '350', md: '450', lg: '600' }}
                        py="8"
                     >
                        <TouchableOpacity>
                           <Heading
                              size="lg"
                              color="coolGray.800"
                              _dark={{
                                 color: 'warmGray.50',
                              }}
                              fontWeight="semibold"
                           >
                              <NavLink routeName="mainFlow" text="Go back" />
                           </Heading>
                        </TouchableOpacity>
                        <VStack space={3} mt="20">
                           <FormControl>
                              <FormControl.Label>
                                 Current Password
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
                                 defaultValue={values.currentPassword}
                                 placeholder="Current password"
                                 onChangeText={handleChange('currentPassword')}
                                 onBlur={handleBlur('currentPassword')}
                                 borderColor={
                                    errors.currentPassword && 'red.500'
                                 }
                              />
                              {errors.currentPassword && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.currentPassword}
                                    </FormControl.ErrorMessage>
                                 </FormControl>
                              )}
                           </FormControl>
                           <FormControl>
                              <FormControl.Label>
                                 New Password
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
                                 defaultValue={values.newPassword}
                                 placeholder="New password"
                                 onChangeText={handleChange('newPassword')}
                                 onBlur={handleBlur('newPassword')}
                                 secureTextEntry
                                 borderColor={errors.newPassword && 'red.500'}
                              />
                              {errors.newPassword && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.newPassword}
                                    </FormControl.ErrorMessage>
                                 </FormControl>
                              )}
                           </FormControl>
                           <FormControl>
                              <FormControl.Label>
                                 Confirm New Password
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
                                 defaultValue={values.newPasswordConfirm}
                                 placeholder="Confirm new password"
                                 onChangeText={handleChange(
                                    'newPasswordConfirm'
                                 )}
                                 onBlur={handleBlur('newPasswordConfirm')}
                                 secureTextEntry
                                 borderColor={
                                    errors.newPasswordConfirm && 'red.500'
                                 }
                              />
                              {errors.newPasswordConfirm && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.newPasswordConfirm}
                                    </FormControl.ErrorMessage>
                                 </FormControl>
                              )}
                              {showErr && (
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
                                                {state.errMessageChangePassword}
                                             </Text>
                                          </HStack>
                                       </HStack>
                                    </VStack>
                                 </Alert>
                              )}
                              {showSuccess && (
                                 <Alert w="100%" status="success" mt="4">
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
                                                {
                                                   state.successMessageChangePassword
                                                }
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
                              Update Password
                           </Button>
                        </VStack>
                     </Box>
                  </Center>
               </>
            )}
         </Formik>
      </View>
   );
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
            <ChangePasswordScreen />
         </Center>
      </NativeBaseProvider>
   );
};
