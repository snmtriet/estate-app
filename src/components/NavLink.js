import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { HStack, Link, Text } from 'native-base';

const NavLink = ({ navigation, text, routeName }) => {
   return (
      <TouchableOpacity
         onPress={() => {
            navigation.navigate(routeName);
         }}
      >
         <HStack mt="0" justifyContent="center">
            <Text
               fontSize="sm"
               color="coolGray.600"
               _dark={{
                  color: 'warmGray.200',
               }}
            >
               {text}
            </Text>
            <Link
               _text={{
                  color: 'indigo.500',
                  fontWeight: 'medium',
                  fontSize: 'sm',
               }}
            >
               {routeName}
            </Link>
         </HStack>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({});

export default withNavigation(NavLink);
