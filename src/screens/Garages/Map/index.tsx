/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Center, Text, View } from 'native-base';
import { observer } from 'mobx-react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { StackScreenProps } from '@react-navigation/stack';

import { GOONG_API_KEY, GOONG_MAP_TILE_KEY } from '@env';
import GarageStore from '@mobx/stores/garage';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { Container } from 'typedi';
import Marker from '@components/map/Marker';
import AssignedEmployee from '@screens/Home/Map/AssignedEmployee';
import RescueStore from '@mobx/stores/rescue';
import { RESCUE_STATUS } from '@utils/constants';
import { mapService } from '@mobx/services/map';
import InvoiceStore from '@mobx/stores/invoice';
import FirebaseStore from '@mobx/stores/firebase';
import AutomotivePartStore from '@mobx/stores/automotive-part';
import ServiceStore from '@mobx/stores/service';
import { Location } from '@models/common';
import { RescueLocationMarker, RescueRoutes, StaffLocationMarker } from '@screens/Home/Map/map-component';
import LocationService from '@mobx/services/location';
import toast from '@utils/toast';

MapboxGL.setAccessToken(GOONG_API_KEY);

const ViewWrapper = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      width: '100%',
      height: 50,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
    }}
  >
    {children}
  </View>
);

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Map'>;

const Map: React.FC<Props> = observer(({ navigation, route }) => {
  //#region stores
  const garageStore = Container.get(GarageStore);
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const firebaseStore = Container.get(FirebaseStore);
  const locationService = Container.get(LocationService);
  //#endregion store

  //#region hooks
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [duration, setDuration] = useState('');
  const [staffLocation, setStaffLocation] = useState<Location | null>(null);

  useEffect(() => {
    void MapboxGL.requestAndroidLocationPermissions();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Platform.OS === 'android') {
        void locationService
          .requestPermission()
          .then((location) => {
            if (location) {
              const { rescueLocation } = rescueStore.currentStaffProcessingRescue!;
              void mapService
                .getDistanceMatrix({
                  api_key: GOONG_API_KEY,
                  origins: `${location.latitude},${location.longitude}`,
                  destinations: `${rescueLocation?.latitude},${rescueLocation?.longitude}`,
                  vehicle: 'car',
                })
                .then(({ result: distanceMatrix }) => {
                  setDuration(`${distanceMatrix?.rows[0].elements[0].duration.text}`);
                });
              setStaffLocation(location);
              firebaseStore.rescueDoc?.update({ staffLocation: JSON.stringify(location) });
            }
          })
          .catch((error) => toast.show(error.message));
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [firebaseStore.rescueDoc, locationService, rescueStore.currentStaffProcessingRescue]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      void rescueStore.getCurrentProcessingStaff().then(() => {
        if (!rescueStore.currentStaffProcessingRescue) {
          navigation.goBack();
        }
      });
    });
  }, [navigation, rescueStore]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const unsub = firebaseStore.rescuesRef.doc(`${rescueStore.currentStaffProcessingRescue?.id}`).onSnapshot(async (snapShot) => {
      if (!snapShot.data()) return;

      await rescueStore.getCurrentProcessingStaff();
      const { status, garageFeedback } = snapShot.data() as { status: number; garageFeedback: boolean };
      switch (status) {
        case RESCUE_STATUS.ACCEPTED: {
          break;
        }
        case RESCUE_STATUS.ARRIVING: {
          break;
        }
        case RESCUE_STATUS.ARRIVED: {
          if (!invoiceStore.garageInvoiceDetail) {
            navigation.navigate('AutomotivePartSuggestion');
          }
          break;
        }
        case RESCUE_STATUS.WORKING: {
          break;
        }
        case RESCUE_STATUS.DONE: {
          break;
        }
        default:
          break;
      }

      if (garageFeedback) {
        navigation.goBack();
      }
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescueStore.currentStaffProcessingRescue?.id, firebaseStore.rescuesRef]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (rescueStore.currentStaffProcessingRescue && rescueStore.currentStaffProcessingRescue?.status !== RESCUE_STATUS.DONE) {
        e.preventDefault();
      }
    });
  }, [navigation, rescueStore.currentStaffProcessingRescue, rescueStore.currentStaffProcessingRescue?.status]);
  //#endregion

  //#region misc
  const { request } = route.params || {};

  function viewDetailRescueRequest() {
    navigation.navigate('DetailRescueRequest', {
      onCancel: () => {
        // setMapState({ ...mapState, rescueState: RESCUE_STATUS.REJECTED });
      },
      person: rescueStore.currentStaffProcessingRescue?.customer,
      duration,
      rescueId: rescueStore.currentStaffProcessingRescue?.id as number,
    });
  }
  //#endregion

  return (
    <Box style={{ ...StyleSheet.absoluteFillObject, height: '100%', width: '100%' }}>
      <MapboxGL.MapView
        style={{ ...StyleSheet.absoluteFillObject }}
        styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_TILE_KEY}`}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={[
            garageStore.garageDefaultGarage?.location.longitude as number,
            garageStore.garageDefaultGarage?.location.latitude as number,
          ]}
        />
        <Marker
          id={garageStore.garageDefaultGarage!.id.toString()}
          coordinate={[garageStore.garageDefaultGarage!.location.longitude, garageStore.garageDefaultGarage!.location.latitude]}
        />
        <RescueLocationMarker coordinate={request?.customerCurrentLocation} />
        <StaffLocationMarker coordinate={staffLocation} />
        <RescueRoutes origin={staffLocation} destination={rescueStore.currentStaffProcessingRescue?.customerCurrentLocation} />
      </MapboxGL.MapView>
      {rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.ARRIVING ? (
        <ViewWrapper>
          <Text bold fontSize='lg'>
            Đang di chuyển
          </Text>
        </ViewWrapper>
      ) : rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.WORKING ? (
        <ViewWrapper>
          <Text bold fontSize='lg'>
            Đang tiến hành sửa chữa
          </Text>
        </ViewWrapper>
      ) : null}
      <Center
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 130,
        }}
      >
        <AssignedEmployee
          viewDetail={viewDetailRescueRequest}
          name={`${request?.customer?.firstName} ${request?.customer?.lastName}`}
          avatarUrl={`${request?.customer?.avatarUrl}`}
          phoneNumber={`${request?.customer?.phoneNumber}`}
        />
      </Center>
      {rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.ARRIVING && (
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 50,
          }}
        >
          <Text bold fontSize='md'>
            Thời gian di chuyển dự kiến: {duration}
          </Text>
        </View>
      )}
      {rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.WORKING ? (
        <TouchableOpacity
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#34A853',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
          }}
          onPress={async () => {
            await firebaseStore.update(`${rescueStore.currentStaffProcessingRescue?.id}`, {
              customerConfirm: true,
            });
            const { invoiceId } = (await firebaseStore.get<{ invoiceId: number }>()) as any;
            await invoiceStore.getGarageInvoiceDetail(invoiceId);
            navigation.push('Payment');
          }}
        >
          <Text bold color='white' fontSize='lg'>
            Hoàn thành sửa chữa
          </Text>
        </TouchableOpacity>
      ) : rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.ARRIVING ? (
        <TouchableOpacity
          onPress={async () => {
            const automotivePartStore = Container.get(AutomotivePartStore);
            const serviceStore = Container.get(ServiceStore);
            automotivePartStore.clearParts();
            serviceStore.clearServices();
            await rescueStore.changeRescueStatusToArrived();
            navigation.navigate('AutomotivePartSuggestion');
          }}
          activeOpacity={0.8}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#FABB05',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
          }}
        >
          <Text bold color='white' fontSize='lg'>
            Xác nhận đã đến nơi
          </Text>
        </TouchableOpacity>
      ) : null}
    </Box>
  );
});

export default Map;
