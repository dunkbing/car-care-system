import { Box, Button, Center, HStack, Text, View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { GOOGLE_API_KEY } from '@env';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const Map: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 21.0278,
    longitude: 105.8342,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  return (
    <Box style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region} loadingEnabled />
      <Box pt={10}>
        <GooglePlacesAutocomplete
          styles={{
            container: {
              flex: 0,
              width: '80%',
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
      <Box>
        <Center pt={'100%'}>
          <Center rounded='5' bg='white' width='90%' height='50'>
            <Text fontSize='lg' bold>
              Madaz - CX5
            </Text>
          </Center>
        </Center>
        <Center pt={'3'}>
          <HStack space={4} width='90%' alignItems='center'>
            <View flex={1}>
              <Button colorScheme='danger'>SOS</Button>
            </View>
            <View flex={1}>
              <Button>Tìm Garage</Button>
            </View>
          </HStack>
        </Center>
      </Box>
    </Box>
  );
};

export default Map;
