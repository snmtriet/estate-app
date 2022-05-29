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
   Badge,
   FlatList,
   Checkbox,
   Icon,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import estateApi from '../api/estate';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

import { Context as AuthContext } from '../context/AuthContext';

const EstateCreateScreen = () => {
   const [isOpen, setIsOpen] = useState(false);
   const toast = useToast();
   const cancelRef = useRef(null);
   const { exportToExcel, state, theme } = useContext(AuthContext);
   const [hasPermission, setHasPermission] = useState(null);
   const [scanned, setScanned] = useState(false);
   const [data, setData] = useState('');
   const [status, setStatus] = useState('');
   const [estate, setEstate] = useState({});
   const [dataScanned, setDataScanned] = useState([]);
   const [async, setAsync] = useState(false);
   const [render, setRender] = useState(false);
   const [loading, setLoading] = useState(true);
   const [loadingBtn, setLoadingBtn] = useState(false);
   const [showErr, setShowErr] = useState(false);
   const [arrayUniqueByKey, setArrayUniqueByKey] = useState([]);
   const [showSuccess, setShowSuccess] = useState(false);
   const [dataCategory, setDataCategory] = useState([]);
   const [dataCategoryUnScan, setDataCategoryUnScan] = useState([]);
   const [visible, setVisible] = useState(false);
   const [visibleDataUnScan, setVisibleDataUnScan] = useState(false);
   const [estatedData, setEstateData] = useState([]);
   const [estateUnscanned, setEstateUnscanned] = useState([]);
   const [estateUnscannedVirtual, setEstateUnscannedVirtual] = useState([]);
   const [isOpen2, setIsOpen2] = useState(false);
   const [isOpenLose, setIsOpenLose] = useState(false);
   const [checkedItem, setCheckedItem] = useState({});
   const [isLoadingLost, setIsLoadingLost] = useState(false);

   useEffect(() => {
      const getData = async () => {
         const token = await AsyncStorage.getItem('token');
         const data = await estateApi.get('/estates', {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setEstateData(data.data.data.estates);
      };
      getData();
   }, []);

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

   function getDifference(array1, array2) {
      return array1.filter((object1) => {
         return !array2.some((object2) => {
            return object1._id === object2._id;
         });
      });
   }

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
            setLoadingBtn(true);
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
                     'dataUnScanned',
                     async (err, result) => {
                        // console.log(
                        //    '🍕 ~ result dataUnScanned',
                        //    JSON.parse(result)
                        // );
                        let dataScan = await AsyncStorage.getItem(
                           'dataScanned'
                        );
                        dataScan = JSON.parse(dataScan);
                        const getDataUnScan = getDifference(
                           estatedData,
                           dataScan
                        );
                        if (result !== null) {
                           // console.log('🍕 ~ result !== null', getDataUnScan);
                           AsyncStorage.setItem(
                              'dataUnScanned',
                              JSON.stringify(getDataUnScan)
                           );
                        } else {
                           // console.log('🍕 ~ result === null', getDataUnScan);
                           AsyncStorage.setItem(
                              'dataUnScanned',
                              JSON.stringify(getDataUnScan)
                           );
                        }
                     }
                  );
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
                     let dm = 0;
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
                           case 'Đã mất':
                              return dm++;
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
                                 dm,
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
            setLoadingBtn(false);
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
            setLoadingBtn(false);
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
         await AsyncStorage.getItem('dataUnScanned').then((data) => {
            if (data) {
               data = JSON.parse(data);
               // console.log('🍕 ~ data', data);
               const arrCate = data.map((item) => {
                  return item.category;
               });
               const arrCategoryUnScanUnique = [
                  ...new Map(
                     arrCate.map((item) => [item['_id'], item])
                  ).values(),
               ];
               // console.log('🍕 ~ arrCategoryUnScan', arrCategoryUnScanUnique);
               setDataCategoryUnScan(arrCategoryUnScanUnique);
               setEstateUnscanned(data);
               setEstateUnscannedVirtual(data);
               // console.log('🍕 ~ data scanned', data);
               setLoading(false);
               setRender(true);
            } else {
               setDataCategoryUnScan([]);
               setEstateUnscanned([]);
               setLoading(false);
               setRender(true);
            }
         });
         await AsyncStorage.getItem('dataScanned')
            .then((data) => {
               // console.log('🍕 ~ dataScanned', dataScanned);
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
            .then(async (arrayUniqueByKey) => {
               if (arrayUniqueByKey) {
                  const arrCate = arrayUniqueByKey.map((item) => {
                     return item.category;
                  });
                  const arrCategoryUnique = [
                     ...new Map(
                        arrCate.map((item) => [item['_id'], item])
                     ).values(),
                  ];
                  setDataCategory(arrCategoryUnique);
                  // console.log('🍕 ~ arrCategoryUnique', arrCategoryUnique);
                  setDataScanned(arrayUniqueByKey);
                  // console.log('🍕 ~ data scanned', arrayUniqueByKey);
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
               setIsLoadingLost(false);
            })
            .catch((err) => console.log(err));
      };

      getData();
   }, [render]);

   const checkExport = async () => {
      if (dataScanned.length > 0 && estateUnscanned.length === 0) {
         exportToExcel();
         setDataScanned([]);
         toast.show({
            title: 'Export success',
            description: 'Xuất thành công!',
            placement: 'top',
            status: 'success',
            duration: 2000,
         });
      } else {
         toast.show({
            title: 'Export warning',
            description: 'Bạn chưa quét hết tài sản!',
            placement: 'top',
            status: 'warning',
            duration: 2000,
         });
      }
   };

   const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      setData(data);
      (getEstate = async () => {
         try {
            await estateApi.get(`/estates/${data}`).then((res) => {
               if (res.data.data.estate) {
                  setEstate(res.data.data.estate);
                  setAsync(true);
               } else {
                  setHasPermission(false);
                  handleScanAgain();
                  onClose();
                  toast.show({
                     title: 'Scan error',
                     description:
                        'QR không đúng định dạng hoặc không tồn tại, vui lòng kiểm tra lại!',
                     placement: 'top',
                     status: 'error',
                     duration: 2000,
                  });
               }
            });
         } catch (error) {
            // console.log('🍕 ~ error', error);
            setHasPermission(false);
            handleScanAgain();
            onClose();
            toast.show({
               title: 'Scan error',
               description:
                  'QR không đúng định dạng hoặc không tồn tại, vui lòng kiểm tra lại!',
               placement: 'top',
               status: 'error',
               duration: 2000,
            });
         }
      })();
   };

   const handleChangeStatusEstate = (e, item) => {
      setCheckedItem({ _id: item._id, name: item.name, isLost: e });
      setIsOpenLose(true);
   };

   const handlePassEstateLosted = async () => {
      const findEstateLost = estateUnscanned.find((item) => {
         return item._id === checkedItem._id;
      });
      const updateEstateLost = { ...findEstateLost, status: 'Đã mất' };
      setIsLoadingLost(true);
      handleUpdateEstate(updateEstateLost._id, updateEstateLost.status).then(
         (ren) => {
            setIsOpenLose(false);
         }
      );
   };

   if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
   }
   if (hasPermission === false) {
      return (
         <Flex bg="#F2F2F2" flex={1} direction="row" safeAreaTop="5">
            {loading ? (
               <View style={{ flex: 1 }}>
                  <Flex direction="row" justifyContent="center" p={2}>
                     <Spinner color="cyan.500" />
                  </Flex>
               </View>
            ) : (
               <View style={{ flex: 1 }}>
                  <Box height={'100%'}>
                     <Flex direction="row" justifyContent="space-between" p={2}>
                        <Flex direction="row" justifyContent="space-between">
                           <VStack mr={5}>
                              <Badge // bg="red.400"
                                 colorScheme="danger"
                                 rounded="full"
                                 mb={-4}
                                 mr={-4}
                                 zIndex={1}
                                 variant="solid"
                                 alignSelf="flex-end"
                                 _text={{
                                    fontSize: 12,
                                 }}
                              >
                                 {dataScanned ? dataScanned.length : 0}
                              </Badge>
                              <Button
                                 mx={{
                                    base: 'auto',
                                    md: 0,
                                 }}
                                 p="2"
                                 _text={{
                                    fontSize: 12,
                                 }}
                                 onPress={() => {
                                    setIsOpen2(false);
                                 }}
                                 bg={!isOpen2 ? 'teal.500' : 'cyan.500'}
                              >
                                 Scanned
                              </Button>
                           </VStack>
                           <VStack>
                              <Badge
                                 colorScheme="danger"
                                 rounded="full"
                                 mb={-4}
                                 mr={-4}
                                 zIndex={1}
                                 variant="solid"
                                 alignSelf="flex-end"
                                 _text={{
                                    fontSize: 12,
                                 }}
                              >
                                 {estateUnscanned ? estateUnscanned.length : 0}
                              </Badge>
                              <Button
                                 mx={{
                                    base: 'auto',
                                    md: 0,
                                 }}
                                 p="2"
                                 bg={isOpen2 ? 'teal.500' : 'cyan.500'}
                                 _text={{
                                    fontSize: 12,
                                 }}
                                 onPress={() => {
                                    setIsOpen2(!isOpen2);
                                 }}
                              >
                                 Unscanned
                              </Button>
                           </VStack>
                        </Flex>
                        {!isOpen2 && dataScanned && dataScanned.length !== 0 ? (
                           <Flex direction="row" justifyContent="space-between">
                              <Button onPress={() => setVisible(true)}>
                                 Filters
                              </Button>
                              <Menu
                                 visible={visible}
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
                                 bg={'cyan.500'}
                                 ml={2}
                                 onPress={checkExport}
                              >
                                 Export
                              </Button>
                           </Flex>
                        ) : (
                           <Flex direction="row" justifyContent="space-between">
                              <Button
                                 bg={'cyan.500'}
                                 onPress={() => setVisibleDataUnScan(true)}
                              >
                                 Filters
                              </Button>
                              <Menu
                                 visible={visibleDataUnScan}
                                 onRequestClose={() =>
                                    setVisibleDataUnScan(false)
                                 }
                              >
                                 <MenuItem
                                    onPress={() => {
                                       setVisibleDataUnScan(false);
                                       setEstateUnscanned(
                                          estateUnscannedVirtual
                                       );
                                    }}
                                 >
                                    All
                                 </MenuItem>
                                 <MenuDivider />
                                 {dataCategoryUnScan.map((item) => {
                                    return (
                                       <MenuItem
                                          key={item._id}
                                          onPress={() => {
                                             const filterCatUnScan =
                                                estateUnscannedVirtual.filter(
                                                   (item2) => {
                                                      return (
                                                         item2.category.name ===
                                                         item.name
                                                      );
                                                   }
                                                );
                                             setEstateUnscanned(
                                                filterCatUnScan
                                             );
                                             setVisibleDataUnScan(false);
                                          }}
                                       >
                                          {item.name}
                                       </MenuItem>
                                    );
                                 })}
                              </Menu>
                              <Button
                                 bg={'cyan.500'}
                                 ml={2}
                                 onPress={checkExport}
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
                     {!isOpen2 ? (
                        <FlatList
                           nestedScrollEnabled
                           data={dataScanned}
                           renderItem={({ item }) => (
                              <Box
                                 borderWidth="1"
                                 borderColor="coolGray.300"
                                 shadow="3"
                                 flex={1}
                                 bg={'#fff'}
                                 p="5"
                                 rounded="8"
                                 mb={2}
                                 ml={2}
                                 mr={2}
                              >
                                 <HStack alignItems="center">
                                    <Text
                                       fontSize="lg"
                                       color="coolGray.700"
                                       fontWeight="medium"
                                    >
                                       {item.name}
                                    </Text>
                                    <Spacer />
                                    <Text fontSize={16} color="coolGray.800">
                                       Lần kiểm gần đây
                                    </Text>
                                 </HStack>
                                 <HStack alignItems="center">
                                    <Text
                                       mt="2"
                                       fontSize="sm"
                                       color="coolGray.700"
                                    >
                                       {item.status}
                                    </Text>
                                    <Spacer />
                                    <Text fontSize={16} color="coolGray.800">
                                       {moment(item.updatedAt).format(
                                          'DD/MM/YYYY HH:mm'
                                       )}
                                    </Text>
                                 </HStack>
                              </Box>
                           )}
                           keyExtractor={(item) => item._id}
                        />
                     ) : (
                        <FlatList
                           data={estateUnscanned}
                           nestedScrollEnabled
                           renderItem={({ item, index }) => (
                              <Box
                                 borderWidth="1"
                                 borderColor="coolGray.300"
                                 shadow="3"
                                 flex={1}
                                 bg={'#fff'}
                                 p="5"
                                 rounded="8"
                                 mb={2}
                                 ml={2}
                                 mr={2}
                              >
                                 <HStack alignItems="center">
                                    <Text
                                       fontSize="lg"
                                       color="coolGray.700"
                                       fontWeight="medium"
                                    >
                                       {item.name}
                                    </Text>
                                    <Spacer />
                                    <Text fontSize={16} color="coolGray.800">
                                       Lần kiểm gần đây
                                    </Text>
                                 </HStack>
                                 <HStack alignItems="center">
                                    <Text
                                       mt="2"
                                       fontSize="sm"
                                       color="coolGray.700"
                                    >
                                       {item.status}
                                    </Text>
                                    <Spacer />
                                    <Text fontSize={16} color="coolGray.800">
                                       {moment(item.updatedAt).format(
                                          'DD/MM/YYYY HH:mm'
                                       )}
                                    </Text>
                                 </HStack>
                                 <Spacer my={2} />
                                 <HStack alignItems="center">
                                    <Checkbox
                                       colorScheme="red"
                                       value={item._id}
                                       isChecked={
                                          checkedItem &&
                                          checkedItem._id === item._id
                                             ? checkedItem.isLost
                                             : false
                                       }
                                       size="md"
                                       onChange={(e) => {
                                          handleChangeStatusEstate(e, item);
                                       }}
                                       icon={
                                          <Icon
                                             as={
                                                <MaterialCommunityIcons name="campfire" />
                                             }
                                          />
                                       }
                                    >
                                       <Text color={'red.600'} ml={2}>
                                          Tài sản này đã mất ?
                                       </Text>
                                    </Checkbox>
                                    <Spacer />
                                 </HStack>
                                 <Center>
                                    <AlertDialog
                                       leastDestructiveRef={cancelRef}
                                       isOpen={isOpenLose}
                                       onClose={() => {
                                          setCheckedItem({
                                             ...checkedItem,
                                             isLost: false,
                                          });
                                          setIsOpenLose(false);
                                       }}
                                    >
                                       <AlertDialog.Content>
                                          <AlertDialog.CloseButton />
                                          <AlertDialog.Header>
                                             <Flex direction="row">
                                                <Text bold>Xác nhận </Text>
                                                <Text bold color={'red'}>
                                                   {checkedItem.name}
                                                </Text>
                                                <Text bold> đã mất ?</Text>
                                             </Flex>
                                          </AlertDialog.Header>
                                          <AlertDialog.Body>
                                             <Flex direction="row">
                                                <Text>Tài sản </Text>
                                                <Text bold>
                                                   {checkedItem.name}
                                                </Text>
                                                <Text> đã mất ?</Text>
                                             </Flex>
                                          </AlertDialog.Body>
                                          <AlertDialog.Footer>
                                             <Button.Group space={2}>
                                                <Button
                                                   variant="unstyled"
                                                   colorScheme="coolGray"
                                                   onPress={() => {
                                                      setCheckedItem({
                                                         ...checkedItem,
                                                         isLost: false,
                                                      });
                                                      setIsOpenLose(false);
                                                   }}
                                                   ref={cancelRef}
                                                >
                                                   Hủy
                                                </Button>
                                                {isLoadingLost ? (
                                                   <Button
                                                      isLoading={true}
                                                      _loading={{
                                                         bg: 'primary.500',
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
                                                      colorScheme="danger"
                                                      onPress={
                                                         handlePassEstateLosted
                                                      }
                                                   >
                                                      Tiếp tục
                                                   </Button>
                                                )}
                                             </Button.Group>
                                          </AlertDialog.Footer>
                                       </AlertDialog.Content>
                                    </AlertDialog>
                                 </Center>
                              </Box>
                           )}
                           keyExtractor={(item) => item._id}
                        />
                     )}
                  </Box>
                  {/* divide */}

                  <View style={styles.centerBtnQR}>
                     <Button
                        style={styles.btnQR}
                        onPress={() => {
                           setHasPermission(true);
                           setIsOpen(!isOpen);
                           setRender(true);
                        }}
                        disabled={showErr}
                     >
                        QR
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
                     {!loadingBtn ? (
                        <Button
                           bg={'primary.400'}
                           onPress={() => {
                              handleUpdateEstate(data, status);
                           }}
                        >
                           Lưu
                        </Button>
                     ) : (
                        <Button
                           isLoading
                           _loading={{
                              bg: 'primary.400:alpha.70',
                              _text: {
                                 color: 'black',
                              },
                           }}
                           _spinner={{
                              color: 'black',
                           }}
                           isLoadingText="Đang lưu"
                        ></Button>
                     )}
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
   centerBtnQR: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 2,
      right: '50%',
      transform: [
         {
            translateX: Dimensions.get('window').width / 12,
         },
      ],
   },
   btnQR: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
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
