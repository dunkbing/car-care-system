import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, ListRenderItemInfo, Platform, StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View } from 'native-base';
import { observer } from 'mobx-react';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { StackScreenProps } from '@react-navigation/stack';
import { Location } from 'react-native-location';
import { GOONG_API_KEY, GOONG_MAP_TILE_KEY } from '@env';
import polyline from '@mapbox/polyline';

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

export enum RescueState {
  IDLE,
  ACCEPTED,
  REJECTED,
}

type MapState = {
  userLocation: { latitude: number; longitude: number };
  rescueLocation?: { latitude: number; longitude: number } | Location;
  garageLocation?: { latitude: number; longitude: number } | Location;
  rescueRoute?: [number, number][];
  garage: GarageModel | null;
  rescueState: RescueState;
};

type Props = StackScreenProps<RescueStackParams, 'Map'>;

const Map: React.FC<Props> = ({ navigation }) => {
  const [mapState, setMapState] = useState<MapState>({
    userLocation: {
      latitude: 21.0278,
      longitude: 105.8342,
    },
    garage: null,
    rescueState: RescueState.IDLE,
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const garageStore = useContext(GarageStore);
  const dialogStore = useContext(DialogStore);

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
    };
  }

  async function searchPlaces(input: string) {
    const { result, error } = await mapService.getPlaces({ input, api_key: GOONG_API_KEY });
    if (error == null) {
      setPlaces(result?.predictions || []);
    }
  }

  /**
   * when sos button is clicked.
   */
  function handleSos() {
    if (!garageStore.defaultGarage) {
      dialogStore.openMsgDialog({ message: 'Bạn chưa đăng kí garage mặc định', onAgreed: () => {} });
      return;
    }
    navigation.navigate('DefineCarStatus', {
      onConfirm: () => {
        dialogStore.openMsgDialog({
          message: `${garageStore.defaultGarage?.name} đã chấp nhận yêu cầu cứu hộ của bạn`,
          onAgreed: () => {
            const { rescueLocation } = mapState;
            const { location: garaLocation } = garageStore.defaultGarage as GarageModel;
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
                      rescueState: RescueState.ACCEPTED,
                      rescueRoute: polyline.decode(result.routes[0].overview_polyline.points),
                    });
                  }
                });
              setMapState({
                ...mapState,
                rescueState: RescueState.ACCEPTED,
              });
              setTimeout(() => {
                setMapState({
                  ...mapState,
                  rescueState: RescueState.IDLE,
                });
              }, 10000);
            }
          },
        });
      },
    });
  }

  function viewDetailRescueRequest() {
    navigation.navigate('DetailRescueRequest', {
      onCancel: () => {
        setMapState({ ...mapState, rescueState: RescueState.REJECTED });
      },
    });
  }

  return (
    <Box style={{ ...StyleSheet.absoluteFillObject, height: '100%', width: '100%' }}>
      <MapboxGL.MapView
        style={{ ...StyleSheet.absoluteFillObject }}
        styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_TILE_KEY}`}
        onTouchStart={() => {
          setMapState({ ...mapState, garage: null });
        }}
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
            // cameraRef.current?.fitBounds(
            //   [result?.result.geometry.location.lng as number, result?.result.geometry.location.lat as number],
            //   [mapState.userLocation.longitude, mapState.userLocation.latitude],
            // );
          }}
        />
      </Box>
      {mapState.garage && (
        <Center pt={50}>
          <PopupGarage name={mapState.garage.name} active rating={3.5} totalRating={59} handleSos={handleSos} />
        </Center>
      )}
      {mapState.rescueState !== RescueState.ACCEPTED ? (
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
