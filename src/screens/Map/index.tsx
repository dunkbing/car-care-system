import SearchBar from '@screens/Garages/SearchBar';
import { Box, Button, Center, HStack, Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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

const MapScreen: React.FC = () => {
  return (
    <Box style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 21.0278,
          longitude: 105.8342,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        loadingEnabled
      />
      <Box pt={10}>
        <SearchBar placeholder='Nhập vị trí cần cứu hộ' />
      </Box>
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
  );
};

export default MapScreen;
