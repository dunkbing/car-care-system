import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ListRenderItemInfo, Platform, StyleSheet } from 'react-native';
import { Box, Button, Center, HStack, Text, View } from 'native-base';
import { observer } from 'mobx-react';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { StackScreenProps } from '@react-navigation/stack';
import RNLocation, { Location } from 'react-native-location';
import { GOONG_API_KEY, GOONG_MAP_TILE_KEY } from '@env';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';

import CarCarousel from './CarCarousel';
import PopupGarage from './PopupGarage';
import AssignedEmployee from './AssignedEmployee';
import { GarageModel } from '@models/garage';
import { Place } from '@models/map';
import GarageStore from '@mobx/stores/garage';
import DialogStore from '@mobx/stores/dialog';
import { mapService } from '@mobx/services/map';
import { RescueStackParams } from '@screens/Navigation/params';
import { Container } from 'typedi';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';
import { INVOICE_STATUS, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import RescueStore from '@mobx/stores/rescue';
import { RescueDetailRequest } from '@models/rescue';
import CarStore from '@mobx/stores/car';
import toast from '@utils/toast';
import { parallel } from '@utils/parallel';
import { withProgress } from '@mobx/services/config';
import { CarModel } from '@models/car';
import RescueStatusBar from './RescueStatusBar';
import InvoiceStore from '@mobx/stores/invoice';
import { GarageMarkers, RescueLocationMarker, RescueRoutes, StaffLocationMarker } from '../../../components/map';
import { firestoreCollection } from '@mobx/services/api-types';
import { SearchBar, OpacityView } from '@components/index';

Logger.setLogCallback(() => {
  return true;
});

Logger.setLogLevel('info');

const { height } = Dimensions.get('screen');

export const fall = new Animated.Value(1);

export const animatedShadowOpacity = Animated.interpolateNode(fall, {
  inputRange: [0, 1],
  outputRange: [0.5, 0],
});

type Props = StackScreenProps<RescueStackParams, 'Map'>;

const Map: React.FC<Props> = ({ navigation }) => {
  //#region stores
  const garageStore = Container.get(GarageStore);
  const carStore = Container.get(CarStore);
  const dialogStore = Container.get(DialogStore);
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  //#endregion stores

  //#region hooks
  const [userLocation, setUserLocation] = useState<Pick<Location, 'longitude' | 'latitude'>>({
    latitude: 21.0294498,
    longitude: 105.8544441,
  });
  const [rescueLocation, setRescueLocation] = useState<Pick<Location, 'longitude' | 'latitude'>>();
  const [staffLocation, setStaffLocation] = useState<Pick<Location, 'longitude' | 'latitude'>>();
  const [duration, setDuration] = useState('');
  const [garage, setGarage] = useState<GarageModel | null>(null);
  const [address, setAddress] = useState('');
  const [rescueRequestDetail, setRescueRequestDetail] = useState<RescueDetailRequest>({
    carId: -1,
    address: '',
    customerCurrentLocation: {
      latitude: 0,
      longitude: 0,
    },
    garageId: -1,
    rescueCaseId: -1,
    description: '',
    rescueLocation: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [definedCarStatus, setDefinedCarStatus] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);

  /**
   * effect hook for creating new rescue request
   */
  useEffect(() => {
    if (definedCarStatus) {
      void processSosRequest();
      setDefinedCarStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definedCarStatus]);

  useEffect(() => {
    MapboxGL.setAccessToken(GOONG_API_KEY);
  }, []);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      void rescueStore.getCurrentProcessingCustomer();
    });
  }, [navigation, rescueStore]);

  useEffect(() => {
    void withProgress(parallel<void, void>(rescueStore.getCurrentProcessingCustomer(), carStore.getMany()));

    if (Platform.OS === 'android') {
      void MapboxGL.requestAndroidLocationPermissions()
        .then((permision) => {
          if (permision) {
            void RNLocation.getLatestLocation({ timeout: 1000 }).then((location) => {
              if (location) {
                void withProgress(mapService.getGeocoding({ api_key: GOONG_API_KEY, latlng: `${location.latitude},${location.longitude}` }))
                  .then(({ result: geocoding }) => {
                    let car: CarModel | undefined;
                    if (carStore.cars.length >= 2) {
                      car = carStore.cars[1];
                    } else if (carStore.cars.length === 1) {
                      car = carStore.cars[0];
                    }
                    setRescueRequestDetail({
                      ...rescueRequestDetail,
                      customerCurrentLocation: { longitude: location.longitude, latitude: location.latitude },
                      rescueLocation: {
                        longitude: location.longitude,
                        latitude: location.latitude,
                      },
                      address: geocoding?.results[0]?.formatted_address as string,
                      carId: car?.id || -1,
                    });

                    if (!address) {
                      setAddress(geocoding?.results[0]?.formatted_address as string);
                    }
                  })
                  .catch(console.error);
                if (!rescueLocation) {
                  setRescueLocation(location);
                }
              }
            });
          }
        })
        .catch((error) => toast.show(error.message));
    }
    void garageStore.getMany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * when (sos/send request) button is clicked.
   */
  const handleSos = useCallback(
    (garage: GarageModel | null) => {
      return async () => {
        if (!garage) {
          dialogStore.openMsgDialog({ message: 'Bạn chưa đăng kí garage mặc định', type: DIALOG_TYPE.CONFIRM, onAgreed: () => {} });
          return;
        }
        await rescueStore.getRescueCases();
        navigation.navigate('DefineCarStatus', {
          garage,
          onConfirm: (rescueCaseId: number, description: string) => {
            setRescueRequestDetail({
              ...rescueRequestDetail,
              rescueCaseId,
              description,
              garageId: garage.id,
            });
            setGarage(garage);
            setDefinedCarStatus(true);
            dialogStore.openMsgDialog({
              title: 'Chờ garage phản hồi',
              message: 'Quý khách vui lòng chờ garage phản hồi',
              type: DIALOG_TYPE.CANCEL,
              onRefused: () => {},
            });
          },
        });
      };
    },
    [dialogStore, navigation, rescueRequestDetail, rescueStore],
  );

  /**
   * observing current rescue request status.
   */
  const observeRescueStatus = useCallback(() => {
    let timeOutId: NodeJS.Timeout;
    const rescueId = rescueStore.currentCustomerProcessingRescue?.id;
    const rescueUnsub = firestore()
      .collection(firestoreCollection.rescues)
      .doc(`${rescueId}`)
      .onSnapshot((rescueSnapshot) => {
        if (!rescueSnapshot.data()) return;

        void (async function () {
          await rescueStore.getCurrentProcessingCustomer();

          const {
            status,
            invoiceId,
            customerConfirm,
            garageRejected,
            garageRejectReason,
            staffLocation: sl,
          } = (rescueSnapshot.data() as {
            status: number;
            invoiceId: number;
            customerConfirm: boolean;
            customerRejected: boolean;
            garageRejected: boolean;
            garageRejectReason: string;
            staffLocation: string;
          }) || {};
          switch (status) {
            case RESCUE_STATUS.PENDING:
              timeOutId = setTimeout(() => {
                dialogStore.openMsgDialog({
                  title: 'Garage bạn chọn đã quá thời gian phản hồi',
                  message: 'Quý khách vui lòng chọn garage khác để tiếp tục dịch vụ',
                  type: DIALOG_TYPE.BOTH,
                  onAgreed: async () => {
                    // ! TODO: currently reject case is hard coded.
                    await rescueStore.customerRejectCurrentRescueCase({
                      rejectRescueCaseId: 2,
                      rejectReason: 'Tôi đã chờ quá lâu',
                    });
                    navigation.navigate('NearByGarages', {
                      customerLocation: {
                        latitude: rescueRequestDetail.customerCurrentLocation.latitude,
                        longitude: rescueRequestDetail.customerCurrentLocation.longitude,
                      },
                      onSelectGarage: (garage: GarageModel) => {
                        void handleSos(garage)();
                      },
                    });
                  },
                  onRefused: async () => {
                    await rescueStore.getCustomerRejectedRescueCases();

                    if (rescueStore.state === STORE_STATUS.ERROR) {
                      toast.show('Không thể tải dữ liệu');
                      return;
                    } else {
                      navigation.navigate('DefineRequestCancelReason');
                    }
                  },
                });
              }, 1000 * 30);
              dialogStore.openMsgDialog({
                title: 'Chờ garage phản hồi',
                message: 'Quý khách vui lòng chờ garage phản hồi',
                type: DIALOG_TYPE.CANCEL,
                onRefused: async () => {
                  await rescueStore.getCustomerRejectedRescueCases();

                  if (rescueStore.state === STORE_STATUS.ERROR) {
                    toast.show('Không thể tải dữ liệu');
                    return;
                  } else {
                    navigation.navigate('DefineRequestCancelReason');
                  }
                },
              });
              break;
            case RESCUE_STATUS.ACCEPTED: {
              clearTimeout(timeOutId);
              const { garage, rescueLocation } = rescueStore.currentCustomerProcessingRescue!;
              const garageLocation = rescueStore.currentCustomerProcessingRescue!.garage.location;
              void mapService
                .getDistanceMatrix({
                  api_key: GOONG_API_KEY,
                  origins: `${rescueLocation?.latitude},${rescueLocation?.longitude}`,
                  destinations: `${garageLocation.latitude},${garageLocation.longitude}`,
                  vehicle: 'car',
                })
                .then(({ result }) => setDuration(`${result?.rows[0]?.elements[0]?.duration?.text}`));
              dialogStore.openMsgDialog({
                message: `${garage?.name} đã chấp nhận yêu cầu cứu hộ của bạn`,
                type: DIALOG_TYPE.CONFIRM,
                onAgreed: () => {
                  const garageLocation = garage.location;
                  sheetRef.current?.snapTo(1);
                  if (rescueLocation) {
                    cameraRef.current?.fitBounds(
                      [rescueLocation.longitude, rescueLocation.latitude],
                      [garageLocation.longitude, garageLocation.latitude],
                      150,
                      1.5,
                    );
                  }
                },
              });
              break;
            }
            case RESCUE_STATUS.REJECTED:
              dialogStore.closeMsgDialog();
              if (garageRejected) {
                dialogStore.openMsgDialog({
                  title: 'Garage đã từ chối yêu cầu của bạn',
                  message: `${garageRejectReason}`,
                  type: DIALOG_TYPE.CONFIRM,
                  onAgreed: () => {
                    void rescueSnapshot.ref.update({ status: RESCUE_STATUS.IDLE });
                  },
                });
              }
              break;

            case RESCUE_STATUS.ARRIVED: {
              dialogStore.openMsgDialog({
                message: 'Nhân viên cứu hộ của bạn đã đến',
                type: DIALOG_TYPE.CONFIRM,
                onAgreed: async () => {
                  await invoiceStore.getCustomerInvoiceDetail(invoiceId);
                },
              });
              break;
            }

            default:
              break;
          }

          switch (status) {
            case RESCUE_STATUS.ARRIVING:
            case RESCUE_STATUS.WORKING: {
              if (sl) {
                setStaffLocation(JSON.parse(sl));
                if (rescueLocation && staffLocation) {
                  cameraRef.current?.fitBounds(
                    [rescueLocation.longitude, rescueLocation.latitude],
                    [staffLocation.longitude, staffLocation.latitude],
                    80,
                    3.5,
                  );
                }
                void mapService
                  .getDistanceMatrix({
                    api_key: GOONG_API_KEY,
                    origins: `${rescueLocation?.latitude},${rescueLocation?.longitude}`,
                    destinations: `${staffLocation?.latitude},${staffLocation?.longitude}`,
                    vehicle: 'car',
                  })
                  .then(({ result: distanceMatrix }) => {
                    setDuration(`${distanceMatrix?.rows[0]?.elements[0]?.duration?.text}`);
                  })
                  .catch(console.error);
              }
              break;
            }
            case RESCUE_STATUS.DONE: {
              dialogStore.closeMsgDialog();
              setStaffLocation(undefined);
              break;
            }
          }

          if (invoiceId !== null && invoiceId !== undefined) {
            dialogStore.closeMsgDialog();
            const invoiceUnsub = firestore()
              .collection(firestoreCollection.invoices)
              .doc(`${invoiceId}`)
              .onSnapshot((invoiceSnapshot) => {
                if (!invoiceSnapshot.exists) return;

                void (async function () {
                  const { status: invoiceStatus } = invoiceSnapshot.data() as { status: number };
                  switch (invoiceStatus) {
                    case INVOICE_STATUS.DRAFT:
                    case INVOICE_STATUS.SENT_PROPOSAL_TO_MANAGER:
                    case INVOICE_STATUS.CUSTOMER_CONFIRMED_PROPOSAL:
                    case INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER: {
                      dialogStore.closeMsgDialog();
                      await invoiceStore.getCustomerInvoiceDetail(invoiceId);
                      navigation.navigate('RepairSuggestion', { invoiceId });
                      invoiceUnsub();
                      break;
                    }
                    case INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER: {
                      await invoiceStore.getCustomerInvoiceDetail(invoiceId);
                      navigation.navigate('QuotationSuggestion', { invoiceId });
                      invoiceUnsub();
                      break;
                    }
                    default:
                      break;
                  }
                })();
              });
          }

          if (rescueStore.currentCustomerProcessingRescue && customerConfirm && status === RESCUE_STATUS.WORKING) {
            navigation.navigate('Payment', { rescueId });
          }
        })();
      });

    return () => {
      rescueUnsub();
      clearTimeout(timeOutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dialogStore,
    handleSos,
    navigation,
    rescueStore,
    rescueRequestDetail.customerCurrentLocation.latitude,
    rescueRequestDetail.customerCurrentLocation.longitude,
    invoiceStore,
    rescueLocation?.latitude,
    rescueLocation?.longitude,
    staffLocation?.latitude,
    staffLocation?.longitude,
  ]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      void rescueStore.getCurrentProcessingCustomer();
      return observeRescueStatus();
    });
  }, [navigation, observeRescueStatus, rescueStore]);

  useEffect(() => {
    void rescueStore.getCurrentProcessingCustomer();
    return observeRescueStatus();
  }, [
    dialogStore,
    navigation,
    observeRescueStatus,
    rescueLocation?.latitude,
    rescueLocation?.longitude,
    rescueStore,
    rescueStore.currentCustomerProcessingRescue?.id,
  ]);

  const cameraRef = useRef<MapboxGL.Camera>(null);

  //#endregion hooks

  const showPopupGarage = useCallback(
    (garage: GarageModel) => {
      return function () {
        if (!rescueStore.currentCustomerProcessingRescue) {
          setGarage({ ...garage });
          sheetRef.current?.snapTo(0);
        }
      };
    },
    [rescueStore.currentCustomerProcessingRescue],
  );

  const searchPlaces = async (input: string) => {
    const { result, error } = await mapService.getPlaces({ input, api_key: GOONG_API_KEY });
    if (error == null) {
      setPlaces(result?.predictions || []);
    }
  };

  /**
   * process sos request(accept or reject)
   */
  const processSosRequest = async () => {
    await rescueStore.createRescueDetail(rescueRequestDetail);

    if (rescueStore.state === STORE_STATUS.ERROR) {
      dialogStore.closeMsgDialog();
      toast.show(rescueStore.errorMessage);
      return;
    }

    await rescueStore.getCurrentProcessingCustomer();

    if (rescueStore.currentCustomerProcessingRescue?.id) {
      await firestore().collection(firestoreCollection.rescues).doc(`${rescueStore.currentCustomerProcessingRescue.id}`).update({
        status: rescueStore.currentCustomerProcessingRescue.status,
      });
    }
  };

  const selectCar = useCallback(
    (car: CarModel) => {
      setRescueRequestDetail({ ...rescueRequestDetail, carId: car?.id });
    },
    [rescueRequestDetail],
  );

  function viewDetailRescueRequest() {
    navigation.navigate('DetailRescueRequest', {
      onCancel: () => {
        // setMapState({ ...mapState, rescueState: RESCUE_STATUS.REJECTED });
      },
      person: rescueStore.currentCustomerProcessingRescue?.staff,
      duration,
      rescueId: rescueStore.currentCustomerProcessingRescue?.id as number,
      isStaff: true,
    });
  }

  /**
   * render a menu bar base on rescue status
   * @param rescueStatus
   */
  const menuBar = (rescueStatus?: RESCUE_STATUS) => {
    switch (rescueStatus) {
      case RESCUE_STATUS.ACCEPTED:
      case RESCUE_STATUS.ARRIVING:
      case RESCUE_STATUS.ARRIVED:
      case RESCUE_STATUS.WORKING: {
        return (
          <Box width='100%' bottom={0} position='absolute' alignSelf='center'>
            {rescueStatus !== RESCUE_STATUS.ACCEPTED ? (
              <Center
                style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: 80,
                }}
              >
                <AssignedEmployee
                  viewDetail={viewDetailRescueRequest}
                  name={`${rescueStore.currentCustomerProcessingRescue?.staff?.lastName} ${rescueStore.currentCustomerProcessingRescue?.staff?.firstName}`}
                  avatarUrl={`${rescueStore.currentCustomerProcessingRescue?.staff?.avatarUrl}`}
                  phoneNumber={`${rescueStore.currentCustomerProcessingRescue?.staff?.phoneNumber}`}
                />
              </Center>
            ) : (
              <Center w='100%' backgroundColor='white' h='50'>
                <HStack space={2}>
                  <ActivityIndicator />
                  <Text bold>Đang đợi nhân viên khởi hành</Text>
                </HStack>
              </Center>
            )}
          </Box>
        );
      }
      default: {
        return (
          <Box pt={height * 0.65} position='absolute' alignSelf='center'>
            <Center>
              <CarCarousel onSelect={selectCar} />
            </Center>
            <Center pt={'3'}>
              <Button width='33%' colorScheme='danger' onPress={handleSos(garageStore.customerDefaultGarage)}>
                SOS
              </Button>
            </Center>
          </Box>
        );
      }
    }
  };

  return (
    <Box style={{ ...StyleSheet.absoluteFillObject, height: '100%', width: '100%' }}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[190, 0]}
        initialSnap={1}
        borderRadius={20}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        onCloseEnd={() => {}}
        renderContent={() => (
          <PopupGarage
            garage={garage as any}
            handleSos={handleSos(garage as any)}
            viewGarageDetail={() =>
              navigation.navigate('GarageDetail', { garageId: garage?.id as number, side: 'customer', isRescueStack: true })
            }
          />
        )}
      />
      <OpacityView
        pointerEvents={'none'}
        style={{
          opacity: animatedShadowOpacity,
        }}
      />
      <MapboxGL.MapView
        style={{ ...StyleSheet.absoluteFillObject }}
        styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_TILE_KEY}`}
        rotateEnabled={false}
      >
        <MapboxGL.UserLocation
          onUpdate={(location) => {
            setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          }}
          visible={false}
        />
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={[rescueLocation?.longitude || userLocation?.longitude, rescueLocation?.latitude || userLocation.latitude]}
        />
        <RescueLocationMarker coordinate={rescueLocation} />
        <StaffLocationMarker coordinate={staffLocation} />
        <RescueRoutes origin={rescueStore.currentCustomerProcessingRescue?.rescueLocation} destination={staffLocation} />
        <GarageMarkers garages={garageStore.garages} onGaragePress={showPopupGarage} />
      </MapboxGL.MapView>
      {!rescueStore.currentCustomerProcessingRescue && (
        <Box pt={10}>
          <SearchBar
            placeholder={address ? address : 'Nhập vị trí cần cứu hộ'}
            timeout={500}
            width='90%'
            onSearch={searchPlaces}
            listProps={{
              data: places,
              keyExtractor: (item: Place) => item.place_id,
              renderItem: ({ item }: ListRenderItemInfo<Place>) => (
                <View pl='3' py='1' width='100%' backgroundColor='white'>
                  <Text fontSize='md'>{item.description}</Text>
                </View>
              ),
            }}
            onItemPress={async ({ item }: ListRenderItemInfo<Place>) => {
              const { result } = await mapService.getPlaceDetail({ api_key: GOONG_API_KEY, place_id: item.place_id });
              const resLo = {
                latitude: result?.result.geometry.location.lat || rescueLocation?.latitude || userLocation.latitude,
                longitude: result?.result.geometry.location.lng || rescueLocation?.longitude || userLocation.longitude,
              };
              setRescueLocation({
                ...resLo,
              });
              setRescueRequestDetail({
                ...rescueRequestDetail,
                address: item.description,
                rescueLocation: resLo,
              });
              setAddress(item.description);
            }}
          />
        </Box>
      )}
      <RescueStatusBar status={rescueStore.currentCustomerProcessingRescue?.status} duration={duration} />
      {menuBar(rescueStore.currentCustomerProcessingRescue?.status)}
    </Box>
  );
};

export default observer(Map);
