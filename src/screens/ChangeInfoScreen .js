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
   Spinner,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import NavLink from '../components/NavLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import estateApi from '../api/estate';

const updateUserSchema = yup.object().shape({
   fullname: yup
      .string()
      .min(8, ({ min }) => `Fullname must be at least ${min} characters`),
   phone: yup
      .string()
      .matches(
         /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
         'Only number are allowed for this field'
      ),
   age: yup
      .number()
      .min(1, ({ min }) => `age must be at least ${min} year old`)
      .max(200, ({ max }) => `age cannot more than ${max} years old`),
});

const ChangeInfoScreen = ({ navigation }) => {
   const { updateMe, state, clearErrMessage } = useContext(Context);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showErr, setShowErr] = useState(false);
   const [user, setUser] = useState({});
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (state.errMessageUpdateMe) {
         setShowSuccess(false);
         setShowErr(true);
      }
      if (state.successMessageUpdateMe) {
         setShowErr(false);
         setShowSuccess(true);
      }
   }, [state.errMessageUpdateMe, state.successMessageUpdateMe]);

   useEffect(() => {
      var isMounted = false;
      const getData = async () => {
         const token = await AsyncStorage.getItem('token');
         await AsyncStorage.getItem('currentUser').then(async (id) => {
            try {
               const user = await estateApi.get(`/users/${id}`, {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });
               if (user) {
                  setUser(user.data.data.user);
                  isMounted = true;
                  setLoading(false);
               }
            } catch (error) {
               console.log(error.response.data.message);
            }
         });
      };
      getData();
      return () => {
         setUser({});
         isMounted = false;
      };
   }, []);

   return (
      <View style={styles.container}>
         <Formik
            validationSchema={updateUserSchema}
            initialValues={{
               fullname: '',
               age: '',
               phone: '',
            }}
            onSubmit={updateMe}
         >
            {({
               handleChange,
               handleBlur,
               handleSubmit,
               values,
               errors,
               isValid,
               isSubmitting,
            }) => (
               <>
                  <Center w="100%" mt={40}>
                     <NavigationEvents onWillBlur={clearErrMessage} />
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
                              <FormControl.Label>Fullname</FormControl.Label>
                              <Input
                                 padding={{ base: '2', md: '5' }}
                                 type="text"
                                 defaultValue={
                                    loading ? 'loading...' : user.fullname
                                 }
                                 placeholder="Fullname"
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
                              <FormControl.Label>Age</FormControl.Label>
                              <Input
                                 padding={{ base: '2', md: '5' }}
                                 type="text"
                                 defaultValue={
                                    loading ? 'loading...' : user.age
                                 }
                                 placeholder="Age"
                                 onChangeText={handleChange('age')}
                                 onBlur={handleBlur('age')}
                                 borderColor={errors.age && 'red.500'}
                              />
                              {errors.age && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.age}
                                    </FormControl.ErrorMessage>
                                 </FormControl>
                              )}
                           </FormControl>
                           <FormControl>
                              <FormControl.Label>Phone</FormControl.Label>
                              <Input
                                 padding={{ base: '2', md: '5' }}
                                 type="text"
                                 defaultValue={
                                    loading ? 'loading...' : user.phone
                                 }
                                 placeholder="Phone"
                                 onChangeText={handleChange('phone')}
                                 onBlur={handleBlur('phone')}
                                 borderColor={errors.phone && 'red.500'}
                              />
                              {errors.phone && (
                                 <FormControl isInvalid>
                                    <FormControl.ErrorMessage
                                       leftIcon={
                                          <WarningOutlineIcon size="xs" />
                                       }
                                    >
                                       {errors.phone}
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
                                                {state.errMessageUpdateMe}
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
                                                {state.successMessageUpdateMe}
                                             </Text>
                                          </HStack>
                                       </HStack>
                                    </VStack>
                                 </Alert>
                              )}
                           </FormControl>
                           {loading ? (
                              <Button mt="2" bg="indigo.300" disabled={true}>
                                 Update User
                              </Button>
                           ) : isSubmitting ? (
                              <Button
                                 mt="2"
                                 isLoading
                                 _loading={{
                                    bg: 'indigo.600',
                                    _text: {
                                       color: 'white',
                                    },
                                 }}
                                 _spinner={{
                                    color: 'white',
                                 }}
                                 isLoadingText="Submiting..."
                              />
                           ) : (
                              <Button
                                 mt="2"
                                 colorScheme="indigo"
                                 onPress={handleSubmit}
                                 disabled={!isValid}
                              >
                                 Update User
                              </Button>
                           )}
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
            <ChangeInfoScreen />
         </Center>
      </NativeBaseProvider>
   );
};
