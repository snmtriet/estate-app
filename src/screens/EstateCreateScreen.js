import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const EstateCreateScreen = () => {
   return (
      <SafeAreaView forceInset={{ top: 'always' }}>
         <Text style={{ fontSize: 48, marginTop: 20 }}>EstateCreateScreen</Text>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({});

export default EstateCreateScreen;
