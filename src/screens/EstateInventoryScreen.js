import React, { useState, useEffect } from 'react';
import estateApi from '../api/estate';
import {
   Flex,
   Box,
   Heading,
   HStack,
   Text,
   Spacer,
   NativeBaseProvider,
   Button,
   VStack,
   Pressable,
   Badge,
   PresenceTransition,
   FlatList,
   Skeleton,
} from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';

const EstateInventoryScreen = () => {
   const [render, setRender] = useState(false);
   const [loading, setLoading] = useState(true);
   const [isOpen, setIsOpen] = useState(false);
   const [dataInventory, setDataInventory] = useState([]);
   const [estatesInventories, setEstatesInventories] = useState([]);

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
         <NavigationEvents onLayout={() => setIsOpen(false)} />

         <Box flex={1}>
            <Flex
               direction="row"
               justifyContent="space-between"
               alignItems="center"
            >
               <Heading fontSize="xl" p="4" pb="3">
                  Inventories
               </Heading>
               {!isOpen ? (
                  <Button
                     mr={2}
                     onPress={() => {
                        setLoading(true);
                        setRender(!render);
                     }}
                  >
                     Reload
                  </Button>
               ) : (
                  <Button
                     mr={2}
                     onPress={() => {
                        setEstatesInventories([]);
                        setIsOpen(!isOpen);
                     }}
                  >
                     Hide
                  </Button>
               )}
            </Flex>
            {loading ? (
               <Box>
                  {[1, 2, 3, 4].map((item) => {
                     return (
                        <Box key={item} mb={5} ml={5} mr={5}>
                           <VStack
                              w="100%"
                              maxW={Dimensions.get('window').width}
                              borderWidth="1"
                              shadow="1"
                              borderColor="coolGray.300"
                              space={2}
                              overflow="hidden"
                              rounded="md"
                           >
                              <HStack>
                                 <Skeleton
                                    px="4"
                                    py="3"
                                    width="40"
                                    rounded="full"
                                    startColor="primary.200"
                                 />
                                 <Spacer />
                                 <Skeleton
                                    px="4"
                                    py="3"
                                    width="40"
                                    rounded="full"
                                 />
                              </HStack>
                              <Skeleton.Text px="4" width="220" />
                              <Skeleton
                                 px="4"
                                 py="4"
                                 width="40"
                                 rounded="md"
                                 startColor="darkBlue.400"
                              />
                           </VStack>
                        </Box>
                     );
                  })}
               </Box>
            ) : (
               <FlatList
                  data={dataInventory}
                  renderItem={({ item, index }) => (
                     <Box mb={5} ml={5} mr={5}>
                        <Pressable
                           onPress={() => {
                              setEstatesInventories(item.checkList);
                              setIsOpen(!isOpen);
                           }}
                        >
                           {({ isHovered, isFocused, isPressed }) => {
                              return (
                                 <Box
                                    borderWidth="1"
                                    borderColor="coolGray.300"
                                    shadow="3"
                                    flex={1}
                                    bg={
                                       isPressed
                                          ? 'coolGray.200'
                                          : isHovered
                                          ? 'coolGray.200'
                                          : 'coolGray.100'
                                    }
                                    p="5"
                                    rounded="8"
                                    style={{
                                       transform: [
                                          {
                                             scale: isPressed ? 0.96 : 1,
                                          },
                                       ],
                                    }}
                                 >
                                    <HStack alignItems="center">
                                       <Badge
                                          colorScheme="primary.400"
                                          _text={{
                                             color: 'white',
                                          }}
                                          variant="solid"
                                          rounded="4"
                                       >
                                          Th??ng tin ki???m k??
                                       </Badge>
                                       <Spacer />
                                       <Text fontSize={16} color="coolGray.800">
                                          {moment(item.createdAt).format(
                                             'DD/MM/YYYY HH:mm'
                                          )}
                                       </Text>
                                    </HStack>
                                    <Text
                                       color="coolGray.800"
                                       mt="3"
                                       fontWeight="medium"
                                       fontSize="xl"
                                    >
                                       ???? {item.user.fullname}
                                    </Text>
                                    <Text
                                       mt="2"
                                       fontSize="sm"
                                       color="coolGray.700"
                                    >
                                       ???? {item.user.faculty.describe}
                                    </Text>
                                    <Flex>
                                       {isFocused ? (
                                          <Text
                                             mt="2"
                                             fontSize={12}
                                             fontWeight="medium"
                                             textDecorationLine="underline"
                                             color="darkBlue.600"
                                             alignSelf="flex-start"
                                          >
                                             Xem chi ti???t
                                          </Text>
                                       ) : (
                                          <Text
                                             mt="2"
                                             fontSize={12}
                                             fontWeight="medium"
                                             color="darkBlue.600"
                                          >
                                             Xem chi ti???t
                                          </Text>
                                       )}
                                    </Flex>
                                 </Box>
                              );
                           }}
                        </Pressable>
                     </Box>
                  )}
                  keyExtractor={(item) => item._id}
               />
            )}
            <PresenceTransition
               style={styles.modal}
               visible={isOpen}
               initial={{
                  opacity: 0,
                  scale: 0,
               }}
               animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                     duration: 250,
                  },
               }}
            >
               <FlatList
                  data={estatesInventories}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  renderItem={({ item, index }) => (
                     <Box mb={5} ml={5} mr={5}>
                        <Box>
                           <Box
                              borderWidth="1"
                              borderColor="coolGray.300"
                              shadow="3"
                              flex={1}
                              bg={'coolGray.100'}
                              p="5"
                              rounded="8"
                           >
                              <HStack alignItems="center">
                                 <Badge
                                    colorScheme="primary.400"
                                    _text={{
                                       color: 'white',
                                    }}
                                    variant="solid"
                                    rounded="4"
                                 >
                                    {('0' + ++index).slice(-2)}
                                 </Badge>
                                 <Spacer />
                                 <Text fontSize={16} color="coolGray.800">
                                    {moment(item.createdAt).format(
                                       'DD/MM/YYYY'
                                    )}
                                 </Text>
                              </HStack>
                              <Text
                                 color="coolGray.800"
                                 mt="3"
                                 fontWeight="medium"
                                 fontSize="xl"
                              >
                                 {item.name}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - M?? t??? : {item.describe}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - S??? l?????ng theo ki???m k?? th???c t???:{' '}
                                 {item.totalEstate}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - ??ang s??? d???ng: {item.statistics.dsd}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - ???? m???t : {item.statistics.dm}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - H?? h???ng xin thanh l??: {item.statistics.hhxtl}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - H?? h???ng ch??? s???a ch???a: {item.statistics.hhcsc}
                              </Text>
                              <Text mt="2" fontSize="sm" color="coolGray.700">
                                 - Kh??ng c?? nhu c???u s??? d???ng :{' '}
                                 {item.statistics.kncsd}
                              </Text>
                           </Box>
                        </Box>
                     </Box>
                  )}
                  keyExtractor={(item) => item._id}
               />
            </PresenceTransition>
         </Box>
      </Flex>
   );
};

const styles = StyleSheet.create({
   modal: {
      position: 'absolute',
      top: 50,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: '#F2F2F2',
   },
});

export default () => {
   return (
      <NativeBaseProvider>
         <EstateInventoryScreen />
      </NativeBaseProvider>
   );
};
