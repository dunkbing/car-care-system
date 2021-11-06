import React from 'react';
import { TouchableNativeFeedback } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Image } from 'native-base';
import { LocationMarker } from '@assets/images';

type Props = {
  id: string;
  coordinate: number[];
  onPress?: () => void;
};

export default ({ id, coordinate, onPress }: Props) => {
  return (
    <MapboxGL.MarkerView id={id} coordinate={coordinate}>
      <TouchableNativeFeedback onPress={onPress}>
        <Image source={LocationMarker} alt='img' size={'xs'} />
      </TouchableNativeFeedback>
    </MapboxGL.MarkerView>
  );
};
