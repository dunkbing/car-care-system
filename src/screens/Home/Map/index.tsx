/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ListRenderItemInfo, Platform, StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View } from 'native-base';
import { observer } from 'mobx-react';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { StackScreenProps } from '@react-navigation/stack';
import { Location } from 'react-native-location';
import { GOONG_API_KEY, GOONG_MAP_TILE_KEY } from '@env';
import polyline from '@mapbox/polyline';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

import CarCarousel from './CarCarousel';
import PopupGarage from './PopupGarage';
import AssignedEmployee from './AssignedEmployee';
import { GarageModel } from '@models/garage';
import { GeocodingResponse, Place } from '@models/map';
import GarageStore from '@mobx/stores/garage';
import locationService from '@mobx/services/location';
import DialogStore from '@mobx/stores/dialog';
import { mapService } from '@mobx/services/map';
import { RescueStackParams } from '@screens/Navigation/params';
import SearchBar from '@components/SearchBar';
import Marker from '../../../components/map/Marker';
import { Container } from 'typedi';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';
import { RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import RescueStore from '@mobx/stores/rescue';
import { RescueDetailRequest } from '@models/rescue';
import CarStore from '@mobx/stores/car';
import toast from '@utils/toast';
import { parallel } from '@utils/parallel';
import { ServiceResult, withProgress } from '@mobx/services/config';
import { CarModel } from '@models/car';
import RescueStatusBar from './RescueStatusBar';

MapboxGL.setAccessToken(GOONG_API_KEY);

Logger.setLogCallback((log) => {
  const { message } = log;

  if (
    /Request failed due to a permanent error: Canceled/.exec(message) ||
    /Request failed due to a permanent error: Socket Closed/.exec(message)
  ) {
    return true;
  }
  return false;
});

const { height } = Dimensions.get('screen');

const OpacityView = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(147, 148, 153, 0.5);
  z-index: 1;
`;
const fall = new Animated.Value(1);

const animatedShadowOpacity = Animated.interpolateNode(fall, {
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
  //#endregion stores

  //#region hooks
  const [userLocation, setUserLocation] = useState<Pick<Location, 'longitude' | 'latitude'>>({
    latitude: 21.0294498,
    longitude: 105.8544441,
  });
  const [rescueLocation, setRescueLocation] = useState<Pick<Location, 'longitude' | 'latitude'>>();
  const [rescueRoute, setRescueRoute] = useState<[number, number][] | null>(null);
  const [duration, setDuration] = useState('');
  const [garage, setGarage] = useState<GarageModel | null>(null);
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
    return navigation.addListener('focus', () => {
      void rescueStore.getCurrentProcessingCustomer();
    });
  }, [navigation, rescueStore]);

  useEffect(() => {
    void locationService
      .requestPermission()
      .then((location) => {
        if (location) {
          setUserLocation(location);
        }
        void withProgress(
          parallel<ServiceResult<GeocodingResponse>, void, void>(
            mapService.getGeocoding({ api_key: GOONG_API_KEY, latlng: `${location!.latitude},${location!.longitude}` }),
            rescueStore.getCurrentProcessingCustomer(),
            carStore.find(),
          ),
        ).then(([{ result: geocoding }]) => {
          let car: CarModel | undefined;
          if (carStore.cars.length >= 2) {
            car = carStore.cars[1];
          } else if (carStore.cars.length === 1) {
            car = carStore.cars[0];
          }
          setRescueRequestDetail({
            ...rescueRequestDetail,
            customerCurrentLocation: { longitude: location!.longitude, latitude: location!.latitude },
            rescueLocation: {
              longitude: location!.longitude,
              latitude: location!.latitude,
            },
            address: geocoding?.results[0].formatted_address as string,
            carId: car?.id || -1,
          });
        });
      })
      .catch(console.log);
    if (Platform.OS === 'android') {
      void MapboxGL.requestAndroidLocationPermissions();
    }
    void garageStore.searchGarage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obserRescueStatus = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const unsub = rescueStore.rescuesRef.doc(`${rescueStore.currentCustomerProcessingRescue?.id}`).onSnapshot(async (snapShot) => {
      console.log('snapshot data: ', snapShot.data());
      if (!snapShot.data()) return;

      await rescueStore.getCurrentProcessingCustomer();
      const { status } = snapShot.data() as { status: number };
      switch (status) {
        case RESCUE_STATUS.PENDING:
          dialogStore.openMsgDialog({
            title: 'Chờ garage phản hồi',
            message: 'Quý khách vui lòng chờ garage phản hồi',
            type: DIALOG_TYPE.CANCEL,
            onRefused: async () => {
              await rescueStore.getCustomerRejectRescueCases();

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
          console.log('rescue accepted');
          const { garage, rescueLocation } = rescueStore.currentCustomerProcessingRescue!;
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
                void mapService
                  .getDirections({
                    api_key: GOONG_API_KEY,
                    origin: `${rescueLocation.latitude},${rescueLocation.longitude}`,
                    destination: `${garageLocation.latitude},${garageLocation.longitude}`,
                  })
                  .then(({ result }) => {
                    if (result?.routes && result.routes.length > 0) {
                      setRescueRoute(polyline.decode(result.routes[0].overview_polyline.points));
                    }
                  });
              }
            },
          });
          break;
        }
        case RESCUE_STATUS.REJECTED:
          dialogStore.openMsgDialog({
            title: 'Garage đã từ chối yêu cầu của bạn',
            message: 'Rất tiếc chúng tôi không thể gửi xe cứu hộ tới vì xe của bạn ở quá xa',
            type: DIALOG_TYPE.CONFIRM,
          });
          break;
        case RESCUE_STATUS.ARRIVING: {
          dialogStore.closeMsgDialog();
          let rescueRoute: [number, number][] | null;
          const garageLocation = rescueStore.currentCustomerProcessingRescue!.garage.location;
          const { rescueLocation } = rescueStore.currentCustomerProcessingRescue!;
          void withProgress(
            parallel(
              mapService.getDirections({
                api_key: GOONG_API_KEY,
                origin: `${rescueLocation?.latitude},${rescueLocation?.longitude}`,
                destination: `${garageLocation.latitude},${garageLocation.longitude}`,
              }),
              mapService.getDistanceMatrix({
                api_key: GOONG_API_KEY,
                origins: `${rescueLocation?.latitude},${rescueLocation?.longitude}`,
                destinations: `${garageLocation.latitude},${garageLocation.longitude}`,
                vehicle: 'car',
              }),
            ),
          ).then(([{ result: direction }, { result: distanceMatrix }]) => {
            if (direction?.routes && direction.routes.length > 0) {
              rescueRoute = polyline.decode(direction.routes[0].overview_polyline.points);
            }
            setRescueRoute(rescueRoute);
            setDuration(`${distanceMatrix?.rows[0].elements[0].duration.text}`);
          });
          break;
        }
        case RESCUE_STATUS.ARRIVED: {
          dialogStore.closeMsgDialog();
          navigation.navigate('ConfirmSuggestedRepair');
          break;
        }
        case RESCUE_STATUS.WORKING: {
          dialogStore.closeMsgDialog();
          break;
        }
        case RESCUE_STATUS.DONE: {
          setRescueRoute(null);
          dialogStore.closeMsgDialog();
          break;
        }
        default:
          break;
      }
    });
    return unsub;
  }, [dialogStore, navigation, rescueStore]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      console.log('focus');
      return obserRescueStatus();
    });
  }, [navigation, obserRescueStatus, rescueStore]);

  useEffect(() => {
    if (!rescueStore.currentCustomerProcessingRescue) return;

    return obserRescueStatus();
  }, [
    dialogStore,
    navigation,
    obserRescueStatus,
    rescueLocation?.latitude,
    rescueLocation?.longitude,
    rescueStore,
    rescueStore.currentCustomerProcessingRescue?.id,
    rescueStore.rescuesRef,
  ]);

  const cameraRef = useRef<MapboxGL.Camera>(null);

  //#endregion hooks

  

  const showPopupGarage = (garage: GarageModel) => {
    return function () {
      if (!rescueStore.currentCustomerProcessingRescue) {
        setGarage({ ...garage });
        sheetRef.current?.snapTo(0);
      }
    };
  };

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
      void rescueStore.rescuesRef.doc(`${rescueStore.currentCustomerProcessingRescue.id}`).update({
        status: rescueStore.currentCustomerProcessingRescue.status,
      });
    }
  };

  /**
   * when (sos/send request) button is clicked.
   */
  const handleSos = (garage: GarageModel | null) => {
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
  };

  function viewDetailRescueRequest() {
    navigation.navigate('DetailRescueRequest', {
      onCancel: () => {
        // setMapState({ ...mapState, rescueState: RESCUE_STATUS.REJECTED });
      },
      staff: rescueStore.currentCustomerProcessingRescue?.staff,
      duration,
      rescueId: rescueStore.currentCustomerProcessingRescue?.id as number,
    });
  }

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
            viewGarageDetail={() => navigation.navigate('GarageDetail', { garage: garage as GarageModel, isRescueStack: true })}
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
      >
        <MapboxGL.UserLocation
          onUpdate={(location) => {
            setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          }}
          visible={false}
        />
        {rescueRoute && (
          <MapboxGL.ShapeSource
            id='line1'
            shape={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: { color: 'green' },
                  geometry: {
                    type: 'LineString',
                    coordinates: [...rescueRoute.map(([latitude, longitude]) => [longitude, latitude])],
                  },
                },
              ],
            }}
          >
            <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 5, lineJoin: 'bevel', lineColor: '#2884d4' }} />
          </MapboxGL.ShapeSource>
        )}
        {rescueLocation && (
          <MapboxGL.PointAnnotation
            key='rescueLocation'
            id='rescueLocation'
            coordinate={[rescueLocation.longitude, rescueLocation.latitude]}
          >
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#00cccc',
                borderRadius: 50,
                borderColor: '#fff',
                borderWidth: 3,
              }}
            />
          </MapboxGL.PointAnnotation>
        )}
        {userLocation && (
          <MapboxGL.PointAnnotation key='userLocation' id='userLocation' coordinate={[userLocation.longitude, userLocation.latitude]}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#00cccc',
                borderRadius: 50,
                borderColor: '#fff',
                borderWidth: 3,
              }}
            />
          </MapboxGL.PointAnnotation>
        )}
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={[rescueLocation?.longitude || userLocation?.longitude, rescueLocation?.latitude || userLocation.latitude]}
        />
        {garageStore.garages.map((garage) => {
          return (
            <Marker
              key={garage.id}
              id={garage.id.toString()}
              coordinate={[garage.location.longitude, garage.location.latitude]}
              onPress={showPopupGarage(garage)}
            />
          );
        })}
      </MapboxGL.MapView>
      <Box pt={10}>
        <SearchBar
          placeholder='Nhập vị trí cần cứu hộ'
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
          }}
        />
      </Box>
      {rescueStore.currentCustomerProcessingRescue?.status === RESCUE_STATUS.ACCEPTED ||
      rescueStore.currentCustomerProcessingRescue?.status === RESCUE_STATUS.ARRIVING ||
      rescueStore.currentCustomerProcessingRescue?.status === RESCUE_STATUS.ARRIVED ||
      rescueStore.currentCustomerProcessingRescue?.status === RESCUE_STATUS.WORKING ? (
        <Box width='100%' pt={height * 0.7} position='absolute' alignSelf='center'>
          <Center>
            {(rescueStore.currentCustomerProcessingRescue?.status !== RESCUE_STATUS.ACCEPTED) && (
              <AssignedEmployee
                viewDetail={viewDetailRescueRequest}
                name={`${rescueStore.currentCustomerProcessingRescue?.staff?.lastName} ${rescueStore.currentCustomerProcessingRescue?.staff?.firstName}`}
                avatarUrl={`${rescueStore.currentCustomerProcessingRescue?.staff?.avatarUrl}`}
                phoneNumber={`${rescueStore.currentCustomerProcessingRescue?.staff?.phoneNumber}`}
              />
            )}
          </Center>
          <Center width='100%' backgroundColor='white' py='3' mt={2}>
            <RescueStatusBar status={rescueStore.currentCustomerProcessingRescue?.status} duration={duration} />
          </Center>
        </Box>
      ) : (
        <Box pt={height * 0.65} position='absolute' alignSelf='center'>
          <Center>
            <CarCarousel
              onSelect={(car) => {
                setRescueRequestDetail({ ...rescueRequestDetail, carId: car?.id });
              }}
            />
          </Center>
          <Center pt={'3'}>
            <Button width='33%' colorScheme='danger' onPress={handleSos(garageStore.customerDefaultGarage)}>
              SOS
            </Button>
          </Center>
        </Box>
      )}
    </Box>
  );
};

export default observer(Map);
