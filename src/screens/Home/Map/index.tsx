import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { Place } from '@models/map';
import GarageStore from '@mobx/stores/garage';
import locationService from '@mobx/services/location';
import DialogStore from '@mobx/stores/dialog';
import { mapService } from '@mobx/services/map';
import { RescueStackParams } from '@screens/Navigation/params';
import SearchBar from '@components/SearchBar';
import Marker from './Marker';
import { Container } from 'typedi';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';
import { RESCUE_STATES } from '@utils/constants';

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

type MapState = {
  userLocation: { latitude: number; longitude: number };
  rescueLocation?: { latitude: number; longitude: number } | Location;
  garageLocation?: { latitude: number; longitude: number } | Location;
  rescueRoute?: [number, number][] | null;
  garage: GarageModel | null;
  rescueState: RESCUE_STATES;
};

type Props = StackScreenProps<RescueStackParams, 'Map'>;

const Map: React.FC<Props> = ({ navigation }) => {
  const [mapState, setMapState] = useState<MapState>({
    userLocation: {
      latitude: 21.0278,
      longitude: 105.8342,
    },
    garage: null,
    rescueState: RESCUE_STATES.IDLE,
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const garageStore = Container.get(GarageStore);
  const dialogStore = useContext(DialogStore);
  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    MapboxGL.setAccessToken(GOONG_API_KEY);
    void locationService
      .requestPermission()
      .then((location) =>
        setMapState({
          ...mapState,
          userLocation: {
            latitude: location!.latitude,
            longitude: location!.longitude,
          },
          rescueLocation: undefined,
        }),
      )
      .catch(console.log);
    if (Platform.OS === 'android') {
      void MapboxGL.requestAndroidLocationPermissions();
    }
    void garageStore.searchGarage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cameraRef = useRef<MapboxGL.Camera>(null);

  function showPopupGarage(garage: GarageModel) {
    return function () {
      setMapState({
        ...mapState,
        garage,
      });
      sheetRef.current?.snapTo(0);
    };
  }

  async function searchPlaces(input: string) {
    const { result, error } = await mapService.getPlaces({ input, api_key: GOONG_API_KEY });
    if (error == null) {
      setPlaces(result?.predictions || []);
    }
  }

  function acceptSos() {
    dialogStore.openMsgDialog({
      message: `${garageStore.customerDefaultGarage?.name} đã chấp nhận yêu cầu cứu hộ của bạn`,
      type: DIALOG_TYPE.CONFIRM,
      onAgreed: () => {
        const { rescueLocation } = mapState;
        const { location: garaLocation } = garageStore.customerDefaultGarage as GarageModel;
        sheetRef.current?.snapTo(1);
        if (rescueLocation) {
          cameraRef.current?.fitBounds(
            [rescueLocation.longitude, rescueLocation.latitude],
            [garaLocation.longitude, garaLocation.latitude],
            150,
            1.5,
          );
          void mapService
            .getDirections({
              api_key: GOONG_API_KEY,
              origin: `${rescueLocation.latitude},${rescueLocation.longitude}`,
              destination: `${garaLocation.latitude},${garaLocation.longitude}`,
            })
            .then(({ result }) => {
              if (result?.routes && result.routes.length > 0) {
                setMapState({
                  ...mapState,
                  rescueState: RESCUE_STATES.ACCEPTED,
                  rescueRoute: polyline.decode(result.routes[0].overview_polyline.points),
                });
              }
            });
          setMapState({
            ...mapState,
            rescueState: RESCUE_STATES.ACCEPTED,
          });
          setTimeout(() => {
            setMapState({
              ...mapState,
              rescueState: RESCUE_STATES.IDLE,
              rescueRoute: null,
            });
          }, 10000);
        }
      },
    });
  }
  /**
   * when sos button is clicked.
   */
  function handleSos() {
    if (!garageStore.customerDefaultGarage) {
      dialogStore.openMsgDialog({ message: 'Bạn chưa đăng kí garage mặc định', type: DIALOG_TYPE.CONFIRM, onAgreed: () => {} });
      return;
    }
    navigation.navigate('DefineCarStatus', {
      onConfirm: () => {
        const id = setTimeout(() => {
          acceptSos();
        }, 5000);
        dialogStore.openMsgDialog({
          title: 'Chờ garage phản hồi',
          message: 'Quý khách vui lòng chờ garage phản hồi',
          type: DIALOG_TYPE.CANCEL,
          onRefused: () => {
            clearTimeout(id);
            setMapState({
              ...mapState,
              rescueState: RESCUE_STATES.REJECTED,
            });
          },
        });
      },
    });
  }

  function viewDetailRescueRequest() {
    navigation.navigate('DetailRescueRequest', {
      onCancel: () => {
        setMapState({ ...mapState, rescueState: RESCUE_STATES.REJECTED });
      },
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
            garage={mapState.garage as any}
            handleSos={handleSos}
            viewGarageDetail={() => navigation.navigate('GarageDetail', { garage: mapState.garage as GarageModel })}
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
            if (!mapState.rescueLocation) {
              setMapState({ ...mapState, rescueLocation: { latitude: location.coords.latitude, longitude: location.coords.longitude } });
            } else {
              setMapState({ ...mapState, userLocation: { latitude: location.coords.latitude, longitude: location.coords.longitude } });
            }
          }}
          visible={false}
        />
        {mapState.rescueRoute && (
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
                    coordinates: [...mapState.rescueRoute.map(([latitude, longitude]) => [longitude, latitude])],
                  },
                },
              ],
            }}
          >
            <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 5, lineJoin: 'bevel', lineColor: '#2884d4' }} />
          </MapboxGL.ShapeSource>
        )}
        <MapboxGL.PointAnnotation
          key='pointAnnotation'
          id='pointAnnotation'
          coordinate={[
            mapState.rescueLocation?.longitude || mapState.userLocation.longitude,
            mapState.rescueLocation?.latitude || mapState.userLocation.latitude,
          ]}
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
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={[
            mapState.rescueLocation?.longitude || mapState.userLocation.longitude,
            mapState.rescueLocation?.latitude || mapState.userLocation.latitude,
          ]}
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
            const { userLocation, rescueLocation } = mapState;
            setMapState({
              ...mapState,
              rescueLocation: {
                latitude: result?.result.geometry.location.lat || rescueLocation?.latitude || userLocation.latitude,
                longitude: result?.result.geometry.location.lng || rescueLocation?.longitude || userLocation.longitude,
              },
            });
          }}
        />
      </Box>
      {mapState.rescueState !== RESCUE_STATES.ACCEPTED ? (
        <Box pt={height * 0.65} position='absolute' alignSelf='center'>
          <Center>
            <CarCarousel />
          </Center>
          <Center pt={'3'}>
            <Button width='33%' colorScheme='danger' onPress={handleSos}>
              SOS
            </Button>
          </Center>
        </Box>
      ) : (
        <Box width='100%' pt={height * 0.7} position='absolute' alignSelf='center'>
          <Center>
            <AssignedEmployee viewDetail={viewDetailRescueRequest} name='Nguyen Ngoc Duc' avatarUrl='' />
          </Center>
          <Center width='100%' backgroundColor='white' py='3' mt={2}>
            <Text>Cứu hộ sẽ đến trong</Text>
            <Text bold>15 phút</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
};

export default observer(Map);
