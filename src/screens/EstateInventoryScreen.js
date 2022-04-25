import React, { useState, useEffect } from 'react';
import estateApi from '../api/estate';
import moment from 'moment';
import {
   Flex,
   Box,
   Heading,
   HStack,
   VStack,
   Text,
   Spacer,
   Center,
   NativeBaseProvider,
   Button,
   Spinner,
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';

const EstateInventoryScreen = () => {
   const [render, setRender] = useState(false);
   const [loading, setLoading] = useState(true);
   const [dataInventory, setDataInventory] = useState([]);

   useEffect(() => {
      const getDataInventory = async () => {
         const dataInventory = await estateApi.get('/inventories');
         setDataInventory(dataInventory.data.data.inventory);
         setLoading(false);
      };
      getDataInventory();
      return () => {
         setDataInventory([]);
      };
   }, [render]);

   return (
      <Flex bg="#F2F2F2" flex={1} direction="row" safeAreaTop="5">
         <Box flex={1}>
            <Flex
               direction="row"
               justifyContent="space-between"
               alignItems="center"
            >
               <Heading fontSize="xl" p="4" pb="3">
                  Inventories
               </Heading>
               <Button mr={2} onPress={() => setRender(!render)}>
                  Reload
               </Button>
            </Flex>
            {loading ? (
               <HStack space={8} justifyContent="center" alignItems="center">
                  <Spinner size="lg" />
               </HStack>
            ) : (
               <FlatList
                  data={dataInventory}
                  renderItem={({ item, index }) => (
                     <Box
                        borderWidth="2"
                        _dark={{
                           borderColor: 'gray.600',
                        }}
                        borderColor="coolGray.500"
                        mb={5}
                     >
                        <Box mb={1}>
                           <Heading
                              fontSize="md"
                              _dark={{
                                 color: 'warmGray.50',
                              }}
                              color="coolGray.600"
                              bold
                           >
                              Ngày kiểm :{' '}
                              {moment(item.createdAt).format('DD-MM-YYYY')}
                           </Heading>
                           <VStack ml={2}>
                              <Text
                                 _dark={{
                                    color: 'warmGray.50',
                                 }}
                                 color="coolGray.600"
                                 bold
                              >
                                 - User: {item.user.fullname}
                              </Text>
                              <Text
                                 _dark={{
                                    color: 'warmGray.50',
                                 }}
                                 color="coolGray.600"
                                 bold
                                 mb={2}
                              >
                                 - Khoa: {item.user.faculty.describe}
                              </Text>
                           </VStack>
                           <Heading
                              fontSize="md"
                              _dark={{
                                 color: 'warmGray.50',
                              }}
                              color="coolGray.600"
                              bold
                           >
                              Danh sách tài sản đã kiểm:
                           </Heading>
                        </Box>

                        {item.checkList.map((item, index) => {
                           return (
                              <HStack
                                 key={item._id}
                                 space={3}
                                 justifyContent="space-evenly"
                                 mb={2}
                                 borderColor="coolGray.500"
                                 borderTopWidth={2}
                              >
                                 <VStack ml={2}>
                                    <Text
                                       _dark={{
                                          color: 'warmGray.50',
                                       }}
                                       color="coolGray.600"
                                       bold
                                    >
                                       - STT : {('0' + ++index).slice(-2)}
                                    </Text>
                                    <Text
                                       _dark={{
                                          color: 'warmGray.50',
                                       }}
                                       color="coolGray.600"
                                       bold
                                    >
                                       - Loại tài sản : {item.name}
                                    </Text>
                                    <Text
                                       _dark={{
                                          color: 'warmGray.50',
                                       }}
                                       color="coolGray.600"
                                       bold
                                    >
                                       - Mô tả : {item.describe}
                                    </Text>
                                    <Text
                                       color="coolGray.600"
                                       _dark={{
                                          color: 'warmGray.200',
                                       }}
                                       bold
                                    >
                                       - Số lượng theo kiểm kê thực tế:{' '}
                                       {item.totalEstate}
                                    </Text>
                                    <Text
                                       color="coolGray.600"
                                       _dark={{
                                          color: 'warmGray.200',
                                       }}
                                       bold
                                    >
                                       - Đang sử dụng: {item.statistics.dsd}
                                    </Text>
                                    <Text
                                       color="coolGray.600"
                                       _dark={{
                                          color: 'warmGray.200',
                                       }}
                                       bold
                                    >
                                       - Hư hỏng xin thanh lý:{' '}
                                       {item.statistics.hhxtl}
                                    </Text>
                                    <Text
                                       color="coolGray.600"
                                       _dark={{
                                          color: 'warmGray.200',
                                       }}
                                       bold
                                    >
                                       - Hư hỏng chờ sửa chữa:{' '}
                                       {item.statistics.hhcsc}
                                    </Text>
                                    <Text
                                       color="coolGray.600"
                                       _dark={{
                                          color: 'warmGray.200',
                                       }}
                                       bold
                                    >
                                       - Không có nhu cầu sử dụng :{' '}
                                       {item.statistics.kncsd}
                                    </Text>
                                 </VStack>
                                 <Spacer />
                              </HStack>
                           );
                        })}
                     </Box>
                  )}
                  keyExtractor={(item) => item._id}
               />
            )}
         </Box>
      </Flex>
   );
};

const styles = StyleSheet.create({});

export default () => {
   return (
      <NativeBaseProvider>
         <EstateInventoryScreen />
      </NativeBaseProvider>
   );
};
