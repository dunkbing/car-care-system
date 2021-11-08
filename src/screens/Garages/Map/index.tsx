/* eslint-disable indent */
import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Center, Text, View } from 'native-base';
import { observer } from 'mobx-react';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { StackScreenProps } from '@react-navigation/stack';
import { GOONG_API_KEY, GOONG_MAP_TILE_KEY } from '@env';

import GarageStore from '@mobx/stores/garage';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { Container } from 'typedi';
import Marker from '@components/map/Marker';
import AssignedEmployee from '@screens/Home/Map/AssignedEmployee';
import RescueStore from '@mobx/stores/rescue';
import { RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

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

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Map'>;

const Map: React.FC<Props> = ({ navigation, route }) => {
  //#region stores
  const garageStore = Container.get(GarageStore);
  const rescueStore = Container.get(RescueStore);
  //#endregion store

  //#region hooks
  const cameraRef = useRef<MapboxGL.Camera>(null);
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }, [navigation]);

  useEffect(() => {
    void rescueStore.getCurrentProcessingStaff();
  }, [rescueStore]);
  //#endregion

  const { request } = route.params || {};

  return (
    <Box style={{ ...StyleSheet.absoluteFillObject, height: '100%', width: '100%' }}>
      <MapboxGL.MapView
        style={{ ...StyleSheet.absoluteFillObject }}
        styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_TILE_KEY}`}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={[garageStore.garage?.location.longitude as number, garageStore.garage?.location.latitude as number]}
        />
        {garageStore.garages.map((garage) => {
          return <Marker key={garage.id} id={garage.id.toString()} coordinate={[garage.location.longitude, garage.location.latitude]} />;
        })}
        <Marker
          id={garageStore.garage!.id.toString()}
          coordinate={[garageStore.garage!.location.longitude, garageStore.garage!.location.latitude]}
        />
        {request?.customerCurrentLocation && (
          <MapboxGL.PointAnnotation
            key='pointAnnotation'
            id='pointAnnotation'
            coordinate={[request?.customerCurrentLocation?.longitude, request?.customerCurrentLocation?.latitude]}
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
      </MapboxGL.MapView>
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
        <Text bold fontSize='lg'>
          Đang di chuyển
        </Text>
      </View>
      <Center
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 130,
        }}
      >
        <AssignedEmployee
          viewDetail={() => {}}
          name={`${request?.customer?.firstName} ${request?.customer?.lastName}`}
          avatarUrl={`${request?.customer?.avatarUrl}`}
          phoneNumber={`${request?.staff?.phoneNumber}`}
        />
      </Center>
      {!(
        rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.WORKING ||
        rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.ARRIVED
      ) && (
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
            Thời gian di chuyển dự kiến: 15 phút
          </Text>
        </View>
      )}
      {rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.WORKING ||
      rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.ARRIVED ? (
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
            await rescueStore.changeRescueStatusToDone();
            navigation.goBack();
          }}
        >
          <Text bold color='white' fontSize='lg'>
            Hoàn thành sửa chữa
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={async () => {
            await rescueStore.changeRescueStatusToArrived();

            if (rescueStore.state === STORE_STATUS.ERROR) {
              toast.show(rescueStore.errorMessage);
            } else {
              navigation.navigate('AutomotivePartSuggestion');
            }
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
      )}
    </Box>
  );
};

export default observer(Map);
