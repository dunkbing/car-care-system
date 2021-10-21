import { Box, Button, Center, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import SmoothPicker from 'react-native-smooth-picker';
import { GOOGLE_API_KEY } from '@env';

const { width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapperVertical: {
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    color: 'black',
    backgroundColor: 'white',
  },
  optionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const dataCity = [
  { name: 'Toyota', license: '29-T8 1147' },
  { name: 'Mazda', license: '29-T8 3045' },
  { name: 'Chevrolet', license: '29-T8 2159' },
];

const opacities = [1, 1, 0.6, 0.3, 0.1];

const sizeText = [18, 13, 8];

const Item = React.memo(({ opacity, selected, fontSize, name, license }: any) => {
  return (
    <VStack
      style={[
        styles.optionWrapper,
        {
          opacity,
          width: (width * 0.9) / 3,
        },
      ]}
    >
      <Text style={{ fontSize }} bold={selected}>
        {name}
      </Text>
      <Text style={{ fontSize }} bold={selected}>
        {license}
      </Text>
    </VStack>
  );
});

const ItemToRender = ({ item, index }: any, indexSelected: number) => {
  const selected = index === indexSelected;
  const gap = Math.abs(index - indexSelected);

  let opacity = opacities[gap];
  if (gap > 3) {
    opacity = opacities[4];
  }
  let fontSize = sizeText[gap];
  if (gap > 1) {
    fontSize = sizeText[2];
  }

  return <Item opacity={opacity} selected={selected} fontSize={fontSize} name={item.name} license={item.license} />;
};

function CarCarousel() {
  function handleChange(index: number) {
    setSelected(index);
  }

  const [selected, setSelected] = React.useState(4);

  return (
    <View py='2' style={styles.wrapperVertical}>
      <SmoothPicker
        initialScrollToIndex={selected}
        onScrollToIndexFailed={() => {}}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        data={dataCity}
        scrollAnimation
        onSelected={({ item, index }) => handleChange(index)}
        renderItem={(option) => ItemToRender(option, selected)}
        magnet
        selectOnPress
        horizontal
        endMargin={100}
      />
    </View>
  );
}

const Map: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 21.0278,
    longitude: 105.8342,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  return (
    <Box style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region} loadingEnabled>
        <Marker coordinate={{ latitude: 21.0278, longitude: 105.8342 }} />
      </MapView>
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
