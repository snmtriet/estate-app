import React, { useState, useRef, useEffect, useContext } from 'react';
import { Center, NativeBaseProvider, Text } from 'native-base';
import { StyleSheet } from 'react-native';

const EstateListScreen = () => {
   return (
      <Center>
         <Text>HEHE</Text>
      </Center>
   );
};

const styles = StyleSheet.create({});

export default () => {
   return (
      <NativeBaseProvider>
         <EstateListScreen />
      </NativeBaseProvider>
   );
};
