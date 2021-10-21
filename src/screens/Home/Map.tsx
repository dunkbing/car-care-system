import { Box, Button, Center, Image } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { GOOGLE_API_KEY } from '@env';
import CarCarousel from './CarCarousel';
import PopupGarage from './PopupGarage';
import { GarageModel } from '@models/garage';

const { height } = Dimensions.get('screen');

const Map: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 21.0278,
    longitude: 105.8342,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [garage, setGarage] = useState<GarageModel | null>(null);
  function showPopupGarage(garage: GarageModel) {
    return function() {
      setGarage(garage);
    }
  }
  return (
    <Box style={{ ...StyleSheet.absoluteFillObject, height: '100%', width: '100%' }}>
      <MapView provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }} region={region} loadingEnabled>
        <Marker coordinate={{ latitude: 21.0278, longitude: 105.8342 }} onPress={() => console.log('click')}>
          <Image alt='marker' source={require('@assets/images/location-marker.png')} style={{ width: 45 }} />
        </Marker>
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
          fetchDetails
          onPress={(data, details = null) => {
            if (details?.geometry.location) {
              const { lat, lng } = details.geometry.location;
              setRegion({ ...region, latitude: lat, longitude: lng });
            }
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'vi',
          }}
          nearbyPlacesAPI='GooglePlacesSearch'
        />
      </Box>
      {garage && <Center pt={50}><PopupGarage name='Gara Oto Trung Anh' active rating={3.5} totalRating={59} /></Center>}
      <Box pt={height * 0.7} position='absolute' alignSelf='center'>
        <Center>
          <CarCarousel />
        </Center>
        <Center pt={'3'}>
          <Button width='33%' colorScheme='danger'>
            SOS
          </Button>
        </Center>
      </Box>
    </Box>
  );
};

export default Map;
