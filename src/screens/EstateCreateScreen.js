import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
   Box,
   Center,
   NativeBaseProvider,
   Button,
   Radio,
   Stack,
   Text,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';
import estateApi from '../api/estate';

const EstateCreateScreen = () => {
   const { updateEstate, exportToExcel, state, clearErrMessage } =
      useContext(AuthContext);
   const [hasPermission, setHasPermission] = useState(null);
   const [scanned, setScanned] = useState(false);
   const [data, setData] = useState('');
   const [currentUser, setCurrentUser] = useState('');
   const [status, setStatus] = useState('');
   const [errRadio, setErrRadio] = useState('');
   const [successRadio, setSuccessRadio] = useState('');
   const [estate, setEstate] = useState({});
   const [estateData, setEstateData] = useState([]);

   const handleUpdateEstate = (data, status) => {
      if (!status) {
         setErrRadio('Vui lòng chọn trạng thái!');
      } else {
         if (updateEstate({ data, status })) {
            setErrRadio('');
            setSuccessRadio('Cập nhật thành công');
         }
      }
   };

   const handleScanAgain = () => {
      setStatus('');
      setErrRadio('');
      setSuccessRadio('');
      setScanned(false);
   };

   useEffect(() => {
      const getAsyncData = async () => {
         await AsyncStorage.getItem('currentUser').then((id) => {
            setCurrentUser(id);
         });
      };
      getAsyncData();

      return async () => {
         await AsyncStorage.removeItem('currentUser');
      };
   }, []);

   useEffect(() => {
      (async () => {
         const { status } = await BarCodeScanner.requestPermissionsAsync();
         setHasPermission(status === 'granted');
      })();
   }, []);

   const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      setData(data);

      (getEstate = async () => {
         await estateApi.get(`/estates/${data}`).then((res) => {
            setEstate(res.data.data.estate);
         });
      })();
   };

   if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
   }
   if (hasPermission === false) {
      return (
         <Box>
            <Text>No access to camera</Text>
            <Button
               onPress={() => {
                  setHasPermission(true);
               }}
            >
               Allow camera
            </Button>
         </Box>
      );
   }

   return (
      <ScrollView
         showsVerticalScrollIndicator={false}
         style={{ width: '100%', marginTop: 20 }}
      >
         {/* <NavigationEvents
            onWillBlur={setHasPermission(status === 'expires')}
         /> */}

         {/* <View style={styles.container}>
            <Text>UserID: {currentUser}</Text>
            <View style={styles.barcodebox}>
               <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={{ height: 550, width: 400 }}
               />
            </View>
            {scanned && (
               <View>
                  {estate.name && (
                     <Center>
                        <Text style={styles.maintext}>{estate.name}</Text>
                     </Center>
                  )}
                  <Radio.Group defaultValue="1">
                     <Radio
                        value="Đang sử dụng"
                        my={1}
                        onPress={() => setStatus('Đang sử dụng')}
                     >
                        Đang sử dụng
                     </Radio>
                     <Radio
                        value="Hư hỏng"
                        my={1}
                        onPress={() => setStatus('Hư hỏng')}
                     >
                        Hư hỏng
                     </Radio>
                     <Radio
                        value="Đã mất"
                        my={1}
                        onPress={() => setStatus('Đã mất')}
                     >
                        Đã mất
                     </Radio>
                  </Radio.Group>
                  {successRadio ? (
                     <Text fontSize="md" color="#28A745">
                        {successRadio}
                     </Text>
                  ) : null}
                  {errRadio ? (
                     <Text fontSize="md" color="#DC3545">
                        {errRadio}
                     </Text>
                  ) : null}

                  <Stack direction="row" mb="2.5" mt="1.5" space={3}>
                     <Center>
                        <Button
                           onPress={() => {
                              handleUpdateEstate(data, status);
                           }}
                        >
                           Cập nhật
                        </Button>
                     </Center>
                     <Center>
                        <Button
                           onPress={() => {
                              handleScanAgain();
                           }}
                        >
                           Scan again
                        </Button>
                     </Center>
                  </Stack>
               </View>
            )}
            <Center>
               <Button
                  mt={5}
                  onPress={() => {
                     state.successMessage &&
                        toast.show({
                           title: state.successMessage,
                           placement: 'top-right',
                           backgroundColor: 'green.400',
                        });
                     exportToExcel();
                  }}
               >
                  Export to excel
               </Button>
               {/* {state.errMessage && <Text>{state.errMessage}</Text>} */}
         {/* </Center> */}
         {/* // </View> */}
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   barcodebox: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
      width: 300,
      overflow: 'hidden',
      borderRadius: 30,
      backgroundColor: 'tomato',
   },
   maintext: {
      fontSize: 20,
      margin: 20,
   },
});

export default () => {
   return (
      <NativeBaseProvider>
         <Center flex={1} px="3">
            <EstateCreateScreen />
         </Center>
      </NativeBaseProvider>
   );
};
