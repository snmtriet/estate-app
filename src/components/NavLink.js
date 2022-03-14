import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { HStack, Link, Text, Flex } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const NavLink = ({ navigation, text, routeName }) => {
   return (
      <View>
         <TouchableOpacity
            onPress={() => {
               navigation.navigate(routeName);
            }}
         >
            {routeName !== 'ChangePassword' ? (
               <HStack mt="0" justifyContent="center">
                  {text !== 'Go back' ? (
                     <Text
                        fontSize="sm"
                        color="coolGray.600"
                        _dark={{
                           color: 'warmGray.200',
                        }}
                     >
                        {text}
                     </Text>
                  ) : (
                     <Flex direction="row">
                        <Ionicons
                           name="return-down-back-outline"
                           size={30}
                           color="black"
                        />
                        <Text
                           fontSize="xl"
                           color="black"
                           _dark={{
                              color: 'warmGray.200',
                           }}
                           ml="2"
                        >
                           {text}
                        </Text>
                     </Flex>
                  )}

                  {text === 'Go back' ? null : (
                     <Link
                        _text={{
                           color: 'indigo.500',
                           fontWeight: 'medium',
                           fontSize: 'sm',
                        }}
                     >
                        {routeName}
                     </Link>
                  )}
               </HStack>
            ) : (
               <Text bg="blueGray.50" color="#18181b" fontSize="md">
                  {text}
               </Text>
            )}
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({});

export default withNavigation(NavLink);
