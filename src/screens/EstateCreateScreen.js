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
   Divider,
   Alert,
} from 'native-base';

import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../context/AuthContext';
import estateApi from '../api/estate';
import { Feather } from '@expo/vector-icons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const EstateCreateScreen = () => {
   const [isOpen, setIsOpen] = useState(false);
   const toast = useToast();
   const cancelRef = useRef(null);

   const { exportToExcel, state } = useContext(AuthContext);
   const [hasPermission, setHasPermission] = useState(null);
   const [scanned, setScanned] = useState(false);
   const [data, setData] = useState('');
   const [status, setStatus] = useState('');
   const [estate, setEstate] = useState({});
   const [dataScanned, setDataScanned] = useState([]);
   const [async, setAsync] = useState(false);
   const [render, setRender] = useState(false);
   const [loading, setLoading] = useState(true);
   const [showErr, setShowErr] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [arrayUniqueByKey, setArrayUniqueByKey] = useState([]);
   const [dataCategory, setDataCategory] = useState([]);
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      if (state.errMessageChangePassword) {
         setShowSuccess(false);
         setShowErr(true);
         toast.show({
            title: 'Save error',
            description: state.errMessageChangePassword,
            placement: 'top',
            status: 'error',
            duration: 2000,
         });
      } else {
         setShowErr(false);
         setShowSuccess(false);
      }
      if (state.successMessageUpdateMe) {
         setShowErr(false);
         setShowSuccess(true);
      }
   }, [state.errMessageChangePassword, state.successMessageUpdateMe]);

   const handleUpdateEstate = async (data, status) => {
      if (!status) {
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
         try {
            const token = await AsyncStorage.getItem('token');
            await estateApi
               .patch(
                  `/estates/${data}`,
                  {
                     status,
                     updatedAt: Date.now(),
                  },
                  {
                     headers: {
                        Authorization: `Bearer ${token}`,
                     },
                  }
               )
               .then(async (res) => {
                  await AsyncStorage.getItem('dataScanned', (err, result) => {
                     const estate = [res.data.data.estate];
                     if (result !== null) {
                        var newEstate = JSON.parse(result).concat(estate);
                        AsyncStorage.setItem(
                           'dataScanned',
                           JSON.stringify(newEstate)
                        );
                     } else {
                        AsyncStorage.setItem(
                           'dataScanned',
                           JSON.stringify(estate)
                        );
                     }
                  });
                  await AsyncStorage.getItem(
                     'saveIdsCategory',
                     (err, result) => {
                        const idCategory = [res.data.data.estate.category._id];
                        if (result !== null) {
                           var newIds = JSON.parse(result).concat(idCategory);
                           AsyncStorage.setItem(
                              'saveIdsCategory',
                              JSON.stringify(newIds)
                           );
                        } else {
                           AsyncStorage.setItem(
                              'saveIdsCategory',
                              JSON.stringify(idCategory)
                           );
                        }
                     }
                  );
                  const IdsCategories = await AsyncStorage.getItem(
                     'saveIdsCategory'
                  );
                  const objIds = JSON.parse([IdsCategories]);
                  const onlyUnique = (value, index, self) => {
                     return self.indexOf(value) === index;
                  };
                  const uniqueObjIds = objIds.filter(onlyUnique);
                  const estateList = await estateApi.get('/estates', {
                     headers: {
                        Authorization: `Bearer ${token}`,
                     },
                  });
                  const estateData = estateList.data.data.estates;
                  uniqueObjIds.map(async (id) => {
                     const total = await estateData.filter((item2) => {
                        return id === item2.category._id;
                     });
                     const data = await AsyncStorage.getItem('dataScanned');
                     const parseDataScanned = JSON.parse(data);
                     const key = '_id';
                     const arrayUniqueByKey = [
                        ...new Map(
                           parseDataScanned.map((item) => [item[key], item])
                        ).values(),
                     ];
                     const filter = await arrayUniqueByKey.filter((item2) => {
                        return id === item2.category._id;
                     });
                     const statusArr = filter.map((item) => item.status);
                     let dsd = 0;
                     let hhcsc = 0;
                     let hhxtl = 0;
                     let kncsd = 0;
                     statusArr.map((statusText) => {
                        switch (statusText) {
                           case 'Đang sử dụng':
                              return dsd++;
                           case 'Hư hỏng chờ sửa chữa':
                              return hhcsc++;
                           case 'Hư hỏng xin thanh lý':
                              return hhxtl++;
                           case 'Không nhu cầu sử dụng':
                              return kncsd++;
                           default:
                              throw new Error('Invalid status');
                        }
                     });

                     if (id) {
                        await estateApi.patch(
                           `/categories/${id}`,
                           {
                              totalEstate: total.length,
                              statistics: {
                                 dsd,
                                 hhcsc,
                                 hhxtl,
                                 kncsd,
                              },
                           },
                           {
                              headers: {
                                 Authorization: `Bearer ${token}`,
                              },
                           }
                        );
                     }
                  });
               });

            setHasPermission(false);
            handleScanAgain();
            onClose();
            setRender(false);
            if (!showErr && showSuccess) {
               toast.show({
                  title: 'Save success',
                  description: 'Lưu thành công!',
                  placement: 'top',
                  status: 'success',
                  duration: 2000,
               });
            }
         } catch (error) {
            console.log(error.response.data.message);
            toast.show({
               title: 'Authorization error',
               description: error.response.data.message,
               placement: 'top',
               status: 'error',
               duration: 2000,
            });
         }
      }
   };

   const onClose = () => setIsOpen(false);

   const handleScanAgain = () => {
      setStatus('');
      setScanned(false);
   };
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
               if (arrayUniqueByKey) {
                  const b = arrayUniqueByKey.map((item) => {
                     return item.category;
                  });
                  const arrCategoryUnique = [
                     ...new Map(b.map((item) => [item['_id'], item])).values(),
                  ];
                  setDataCategory(arrCategoryUnique);
                  setDataScanned(arrayUniqueByKey);
                  setArrayUniqueByKey(arrayUniqueByKey);
                  setLoading(false);
                  setRender(true);
               } else {
                  setDataCategory([]);
                  setArrayUniqueByKey([]);
                  setDataScanned([]);
                  setLoading(false);
                  setRender(true);
               }
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
                        <Flex direction="row" justifyContent="space-between">
                           <Menu
                              visible={visible}
                              anchor={
                                 <Button onPress={() => setVisible(true)}>
                                    Filters
                                 </Button>
                              }
                              onRequestClose={() => setVisible(false)}
                           >
                              <MenuItem
                                 onPress={() => {
                                    setVisible(false);
                                    setDataScanned(arrayUniqueByKey);
                                 }}
                              >
                                 All
                              </MenuItem>
                              <MenuDivider />
                              {dataCategory.map((item) => {
                                 return (
                                    <MenuItem
                                       key={item._id}
                                       onPress={() => {
                                          const filterCat =
                                             arrayUniqueByKey.filter(
                                                (item2) => {
                                                   return (
                                                      item2.category.name ===
                                                      item.name
                                                   );
                                                }
                                             );
                                          setDataScanned(filterCat);
                                          setVisible(false);
                                       }}
                                    >
                                       {item.name}
                                    </MenuItem>
                                 );
                              })}
                           </Menu>
                           <Button
                              ml={2}
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
                        </Flex>
                     )}
                  </Flex>
                  {showErr && (
                     <Center>
                        <Alert w="100%" status="error" mt="4">
                           <VStack space={2} flexShrink={1} w="80%">
                              <HStack
                                 flexShrink={1}
                                 space={2}
                                 justifyContent="space-between"
                              >
                                 <HStack space={2} flexShrink={1}>
                                    <Alert.Icon mt="1" />
                                    <Text fontSize="md" color="coolGray.800">
                                       {state.errMessageChangePassword}
                                    </Text>
                                 </HStack>
                              </HStack>
                           </VStack>
                        </Alert>
                     </Center>
                  )}

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
                                 <Text
                                    color="coolGray.600"
                                    _dark={{
                                       color: 'warmGray.200',
                                    }}
                                    bold
                                 >
                                    Ngày tạo:{' '}
                                    {moment(item.createdAt).format(
                                       'DD-MM-YYYY'
                                    )}
                                 </Text>
                                 {item.updatedAt && (
                                    <Text
                                       color="coolGray.600"
                                       _dark={{
                                          color: 'warmGray.200',
                                       }}
                                       bold
                                    >
                                       Lần kiểm gần đây:{' '}
                                       {moment(item.updatedAt).format(
                                          'HH:mm:ss'
                                       )}
                                    </Text>
                                 )}
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
                           setRender(true);
                        }}
                        disabled={showErr}
                     >
                        Kiểm kê
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
                        <View style={styles.barcodebox}>
                           <BarCodeScanner
                              onBarCodeScanned={
                                 scanned ? undefined : handleBarCodeScanned
                              }
                              style={{ height: 600, width: 600 }}
                           />
                        </View>
                        {scanned && (
                           <View>
                              {estate.name && (
                                 <>
                                    <Text style={styles.maintext}>
                                       Tên: {estate.name}
                                    </Text>
                                    <Text style={styles.maintext}>
                                       Loại: {estate.category.name}
                                    </Text>
                                    <Text style={styles.maintext}>
                                       Ngày tạo :{' '}
                                       {moment(estate.createdAt).format(
                                          'DD-MM-YYYY'
                                       )}
                                    </Text>
                                    {estate.updatedAt && (
                                       <Text style={styles.maintext}>
                                          Lần kiểm gần đây :{' '}
                                          {moment(estate.updatedAt).format(
                                             'DD-MM-YYYY HH:mm'
                                          )}
                                       </Text>
                                    )}
                                    <Divider my="2" />
                                 </>
                              )}
                              {async && (
                                 <>
                                    <Text fontSize="md">
                                       Cập nhập trạng thái
                                    </Text>
                                    <Radio.Group defaultValue="1">
                                       <Radio
                                          value="Đang sử dụng"
                                          my={1}
                                          onPress={() =>
                                             setStatus('Đang sử dụng')
                                          }
                                       >
                                          Đang sử dụng
                                       </Radio>
                                       <Radio
                                          value="Hư hỏng xin thanh lý"
                                          my={1}
                                          onPress={() =>
                                             setStatus('Hư hỏng xin thanh lý')
                                          }
                                       >
                                          Hư hỏng xin thanh lý
                                       </Radio>
                                       <Radio
                                          value="Hư hỏng chờ sửa chữa"
                                          my={1}
                                          onPress={() =>
                                             setStatus('Hư hỏng chờ sửa chữa')
                                          }
                                       >
                                          Hư hỏng chờ sửa chữa
                                       </Radio>
                                       <Radio
                                          value="Không nhu cầu sử dụng"
                                          my={1}
                                          onPress={() =>
                                             setStatus('Không nhu cầu sử dụng')
                                          }
                                       >
                                          Không nhu cầu sử dụng
                                       </Radio>
                                    </Radio.Group>
                                 </>
                              )}
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
      height: 400,
      width: 400,
      overflow: 'hidden',
      borderRadius: 30,
   },
   maintext: {
      fontSize: 16,
      margin: 5,
   },
});

export default () => {
   return (
      <NativeBaseProvider>
         <EstateCreateScreen />
      </NativeBaseProvider>
   );
};
