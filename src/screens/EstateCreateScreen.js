import React, { useState, useRef, useEffect, useContext } from 'react';
import moment from 'moment';
import {
   AlertDialog,
   Button,
   Center,
   NativeBaseProvider,
   Radio,
   VStack,
   Heading,
   Text,
   Box,
   HStack,
   Spacer,
   Flex,
   Spinner,
   useToast,
} from 'native-base';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../context/AuthContext';
import estateApi from '../api/estate';
import { Feather } from '@expo/vector-icons';

const EstateCreateScreen = () => {
   const [isOpen, setIsOpen] = useState(false);
   const toast = useToast();
   const cancelRef = useRef(null);

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
   const [dataScanned, setDataScanned] = useState([]);
   const [async, setAsync] = useState(false);
   const [render, setRender] = useState(false);
   const [loading, setLoading] = useState(true);

   const handleUpdateEstate = (data, status) => {
      if (!status) {
         setErrRadio('Vui lòng chọn trạng thái!');
         setHasPermission(false);
         handleScanAgain();
         onClose();
         toast.show({
            title: 'Save warning',
            description: 'Vui lòng chọn trạng thái tài sản vừa quét!',
            placement: 'top',
            status: 'warning',
            duration: 2000,
         });
      } else {
         if (updateEstate({ data, status })) {
            setErrRadio('');
            setSuccessRadio('Cập nhật thành công');
            setHasPermission(false);
            handleScanAgain();
            onClose();
            setRender(false);
            toast.show({
               title: 'Save success',
               description: 'Lưu thành công!',
               placement: 'top',
               status: 'success',
               duration: 2000,
            });
         }
      }
   };

   const onClose = () => setIsOpen(false);

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
   }, []);

   useEffect(() => {
      (async () => {
         const { status } = await BarCodeScanner.requestPermissionsAsync();
         setHasPermission(status === 'expires');
      })();
   }, []);

   useEffect(() => {
      const getData = async () => {
         await AsyncStorage.getItem('dataScanned')
            .then((data) => {
               if (data) {
                  const parseDataScanned = JSON.parse(data);
                  const key = '_id';
                  const arrayUniqueByKey = [
                     ...new Map(
                        parseDataScanned.map((item) => [item[key], item])
                     ).values(),
                  ];
                  return arrayUniqueByKey;
               }
            })
            .then((arrayUniqueByKey) => {
               setDataScanned(arrayUniqueByKey);
               setLoading(false);
               setRender(true);
            })
            .catch((err) => console.log(err));
      };
      getData();
   }, [render]);

   const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      setData(data);
      (getEstate = async () => {
         await estateApi.get(`/estates/${data}`).then((res) => {
            setEstate(res.data.data.estate);
            setAsync(true);
         });
      })();
   };
   if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
   }
   if (hasPermission === false) {
      return (
         <Flex bg="#F2F2F2" flex={1} direction="row" safeAreaTop="5">
            {loading ? (
               <View style={{ flex: 1 }}>
                  <Flex direction="row" justifyContent="space-between" p={2}>
                     <Heading
                        size="md"
                        color="coolGray.600"
                        _dark={{
                           color: 'warmGray.200',
                        }}
                        bold
                        mb={2}
                     >
                        Đã quét: <Spinner color="cyan.500" />
                     </Heading>
                  </Flex>
               </View>
            ) : (
               <View style={{ flex: 1 }}>
                  <Flex direction="row" justifyContent="space-between" p={2}>
                     <Heading
                        size="md"
                        color="coolGray.600"
                        _dark={{
                           color: 'warmGray.200',
                        }}
                        bold
                        mb={2}
                     >
                        Đã quét: {dataScanned ? dataScanned.length : 0}
                     </Heading>
                     {dataScanned && dataScanned.length !== 0 && (
                        <Button
                           onPress={async () => {
                              exportToExcel();
                              setDataScanned([]);
                              toast.show({
                                 title: 'Export success',
                                 description: 'Xuất thành công!',
                                 placement: 'top',
                                 status: 'success',
                                 duration: 2000,
                              });
                           }}
                        >
                           Export
                        </Button>
                     )}
                  </Flex>
                  <FlatList
                     data={dataScanned}
                     renderItem={({ item }) => (
                        <Box
                           borderBottomWidth="1"
                           _dark={{
                              borderColor: 'gray.600',
                           }}
                           borderColor="coolGray.200"
                        >
                           <HStack space={3} justifyContent="space-evenly">
                              <Center ml={'0.5'}>
                                 <Feather
                                    name="check-circle"
                                    size={25}
                                    color="#28A745"
                                 />
                              </Center>
                              <VStack>
                                 <Text
                                    _dark={{
                                       color: 'warmGray.50',
                                    }}
                                    color="coolGray.600"
                                    bold
                                 >
                                    {item.name}
                                 </Text>
                                 <Text
                                    color="coolGray.600"
                                    _dark={{
                                       color: 'warmGray.200',
                                    }}
                                    bold
                                 >
                                    {item.status}
                                 </Text>
                              </VStack>
                              <Spacer />
                              <VStack w={'45%'}>
                                 {/* <Text
                                    _dark={{
                                       color: 'warmGray.50',
                                    }}
                                    color="coolGray.600"
                                    bold
                                 >
                                    {item._id}
                                 </Text> */}
                                 <Text
                                    color="coolGray.600"
                                    _dark={{
                                       color: 'warmGray.200',
                                    }}
                                    bold
                                 >
                                    Ngày mua:{' '}
                                    {moment(item.createdAt).format(
                                       'DD-MM-YYYY'
                                    )}
                                 </Text>
                                 <Text
                                    color="coolGray.600"
                                    _dark={{
                                       color: 'warmGray.200',
                                    }}
                                    bold
                                 >
                                    Giờ tạo:{' '}
                                    {moment(item.createdAt).format('HH:mm:ss')}
                                 </Text>
                              </VStack>
                           </HStack>
                        </Box>
                     )}
                     keyExtractor={(item) => item._id}
                  />
                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '10%',
                     }}
                  >
                     <Button
                        onPress={() => {
                           setHasPermission(true);
                           setIsOpen(!isOpen);
                        }}
                     >
                        Bắt đầu quét
                     </Button>
                  </View>
               </View>
            )}
         </Flex>
      );
   }

   return (
      <Center>
         <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={() => {
               setHasPermission(false);
               handleScanAgain();
               onClose();
            }}
         >
            <AlertDialog.Content w={{ base: '350', md: '550', lg: '600' }}>
               <AlertDialog.CloseButton />
               <AlertDialog.Header alignItems={'center'}>
                  QR Code
               </AlertDialog.Header>
               <AlertDialog.Body>
                  <ScrollView showsVerticalScrollIndicator={false}>
                     <View style={styles.container}>
                        <Text>UserID: {currentUser}</Text>
                        <View style={styles.barcodebox}>
                           <BarCodeScanner
                              onBarCodeScanned={
                                 scanned ? undefined : handleBarCodeScanned
                              }
                              style={{ height: 550, width: 400 }}
                           />
                        </View>
                        {scanned && (
                           <View>
                              {estate.name && (
                                 <Center>
                                    <Text style={styles.maintext}>
                                       {estate.name}
                                    </Text>
                                 </Center>
                              )}
                              {async && (
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
                              )}
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
                           </View>
                        )}
                     </View>
                  </ScrollView>
               </AlertDialog.Body>
               <AlertDialog.Footer>
                  <Button.Group space={2}>
                     <Button
                        variant="unstyled"
                        colorScheme="coolGray"
                        onPress={() => {
                           setHasPermission(false);
                           handleScanAgain();
                           onClose();
                        }}
                        ref={cancelRef}
                     >
                        Cancel
                     </Button>
                     <Button
                        bg={'primary.400'}
                        onPress={() => {
                           handleUpdateEstate(data, status);
                        }}
                     >
                        Lưu
                     </Button>
                  </Button.Group>
               </AlertDialog.Footer>
            </AlertDialog.Content>
         </AlertDialog>
      </Center>
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
         <EstateCreateScreen />
      </NativeBaseProvider>
   );
};
