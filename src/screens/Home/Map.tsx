import { Box, Button, Center, Image, Text } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { GOOGLE_API_KEY } from '@env';
import CarCarousel from './CarCarousel';
import PopupGarage from './PopupGarage';
import { GarageModel } from '@models/garage';
import GarageStore from '@mobx/stores/garage';
import locationService from '@mobx/services/location';
import { observer } from 'mobx-react';
import { Location } from 'react-native-location';
import { RescueStackParams } from '@screens/Navigation/params';
import { StackScreenProps } from '@react-navigation/stack';
import DialogStore from '@mobx/stores/dialog';
import AssignedEmployee from './AssignedEmployee';

const { height } = Dimensions.get('screen');

export enum RescueState {
  IDLE,
  ACCEPTED,
  REJECTED,
}

type MapState = {
  userLocation: { latitude: number; longitude: number } | null;
  mapViewCoordinate: { latitude: number; longitude: number } | Location | null;
  garage: GarageModel | null;
  rescueState: RescueState;
};

type Props = StackScreenProps<RescueStackParams, 'Map'>;

const Map: React.FC<Props> = ({ navigation }) => {
  const [mapState, setMapState] = useState<MapState>({
    mapViewCoordinate: {
      latitude: 21.0278,
      longitude: 105.8342,
    },
    userLocation: {
      latitude: 21.0278,
      longitude: 105.8342,
    },
    garage: null,
    rescueState: RescueState.IDLE,
  });
  const garageStore = useContext(GarageStore);
  const dialogStore = useContext(DialogStore);

  useEffect(() => {
    void locationService
      .requestPermission()
      .then((location) =>
        setMapState({
          ...mapState,
          userLocation: {
            latitude: location!.latitude,
            longitude: location!.longitude,
          },
          mapViewCoordinate: mapState.mapViewCoordinate || {
            latitude: location!.latitude,
            longitude: location!.longitude,
          },
        }),
      )
      .catch(console.log);
    void garageStore.searchGarage('');
  }, []);

  const mapRef = useRef<MapView>(null);

  function showPopupGarage(garage: GarageModel) {
    return function () {
      setMapState({
        ...mapState,
        garage,
        mapViewCoordinate: {
          latitude: garage.location.latitude,
          longitude: garage.location.longitude,
        },
      });
      mapRef.current?.animateToCoordinate({ ...garage.location });
    };
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
            mapRef.current?.animateToNavigation(
              { latitude: garageStore.defaultGarage!.location.latitude, longitude: garageStore.defaultGarage!.location.longitude },
              0,
              0,
              0.5,
            );
            setMapState({
              ...mapState,
              mapViewCoordinate: garageStore.defaultGarage!.location,
              rescueState: RescueState.ACCEPTED,
            });
            setTimeout(() => {
              setMapState({
                ...mapState,
                rescueState: RescueState.IDLE,
              });
            }, 60000);
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
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ ...StyleSheet.absoluteFillObject }}
        region={{ ...(mapState.mapViewCoordinate as any), latitudeDelta: 0.03, longitudeDelta: 0.03 }}
        loadingEnabled
      >
        <Marker
          coordinate={{ latitude: mapState.userLocation?.latitude as number, longitude: mapState.userLocation?.longitude as number }}
        />
        {garageStore.garages.map((garage) => {
          const { location } = garage;
          return (
            <Marker
              key={garage.id}
              coordinate={{ latitude: location?.latitude, longitude: location?.longitude }}
              onPress={showPopupGarage(garage)}
            >
              <Image alt='marker' source={require('@assets/images/location-marker.png')} style={{ width: 45 }} />
            </Marker>
          );
        })}
        {mapState.rescueState === RescueState.ACCEPTED && (
          <Polyline
            coordinates={[
              { latitude: mapState.userLocation!.latitude, longitude: mapState.userLocation!.longitude },
              { latitude: garageStore.defaultGarage!.location.latitude, longitude: garageStore.defaultGarage!.location.longitude },
            ]}
            strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={['#7F0000']}
            strokeWidth={6}
          />
        )}
      </MapView>
      <Box pt={10}>
        <GooglePlacesAutocomplete
          styles={{
            container: {
              flex: 0,
              width: '90%',
              alignSelf: 'center',
            },
            textInput: {
              color: 'black',
              fontSize: 18,
            },
          }}
          textInputProps={{ placeholderTextColor: '#6c6f73' }}
          placeholder='Nhập vị trí cần cứu hộ'
          debounce={500}
          // fetchDetails
          onFail={(error) => console.log(error)}
          onPress={(data, details = null) => {
            if (details?.geometry.location) {
              const { lat, lng } = details.geometry.location;
              setMapState({
                ...mapState,
                userLocation: { latitude: lat, longitude: lng },
                mapViewCoordinate: { latitude: lat, longitude: lng },
              });
            }
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'vi',
            components: 'country:vn',
          }}
          nearbyPlacesAPI='GooglePlacesSearch'
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
