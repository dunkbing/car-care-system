import Marker from '@components/map/Marker';
import { GOONG_API_KEY } from '@env';
import polyline from '@mapbox/polyline';
import { mapService } from '@mobx/services/map';
import { Location, Route } from '@models/common';
import { GarageModel } from '@models/garage';
import MapboxGL from '@react-native-mapbox-gl/maps';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export const GarageMarkers: React.FC<{ garages: GarageModel[]; onGaragePress: (garage: GarageModel) => () => void }> = ({
  garages,
  onGaragePress,
}) => {
  if (!garages || !garages.length) {
    return null;
  }

  return (
    <>
      {garages.map((garage) => {
        return (
          <Marker
            key={garage.id}
            id={garage.id.toString()}
            coordinate={[garage.location.longitude, garage.location.latitude]}
            onPress={onGaragePress(garage)}
          />
        );
      })}
    </>
  );
};

export const RescueLocationMarker: React.FC<{ coordinate?: Location | null }> = ({ coordinate }) => {
  if (!coordinate) return null;

  return (
    <MapboxGL.MarkerView key='rescueLocation' id='rescueLocation' coordinate={[coordinate.longitude, coordinate.latitude]}>
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
    </MapboxGL.MarkerView>
  );
};

export const StaffLocationMarker: React.FC<{ coordinate?: Location | null }> = ({ coordinate }) => {
  if (!coordinate) return null;

  return (
    <MapboxGL.MarkerView key='staffLocation' id='staffLocation' coordinate={[coordinate.longitude, coordinate.latitude]}>
      <View
        style={{
          height: 30,
          width: 30,
          backgroundColor: '#00cc1f',
          borderRadius: 50,
          borderColor: '#fff',
          borderWidth: 3,
        }}
      />
    </MapboxGL.MarkerView>
  );
};

export const RescueRoutes: React.FC<{ origin?: Location | null; destination?: Location | null }> = ({ origin, destination }) => {
  const [routes, setRoutes] = React.useState<Route[]>([]);

  useEffect(() => {
    if (!origin || !destination) return;
    void mapService
      .getDirections({
        api_key: GOONG_API_KEY,
        origin: `${origin.latitude},${origin?.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
      })
      .then(({ result: direction }) => {
        if (direction?.routes && direction.routes.length > 0) {
          const temp = [];
          for (const route of direction.routes) {
            temp.push(polyline.decode(route.overview_polyline.points));
          }
          setRoutes(temp);
        }
      });
  }, [origin, destination]);

  if (!routes || !routes.length) return null;

  return (
    <MapboxGL.ShapeSource
      id={'line'}
      shape={{
        type: 'FeatureCollection',
        features: routes.map((route, index) => {
          const color = index === 0 ? '#058080' : '#86cfcf';
          return {
            type: 'Feature',
            properties: { color },
            geometry: { type: 'LineString', coordinates: route.map(([latitude, longitude]) => [longitude, latitude]) },
          };
        }),
      }}
    >
      {routes.map((route, index) => {
        return (
          <MapboxGL.LineLayer
            key={index}
            id={'lineLayer'}
            style={{ lineWidth: 4, lineJoin: 'bevel', lineColor: ['get', 'color'], lineCap: 'round' }}
          />
        );
      })}
    </MapboxGL.ShapeSource>
  );
};
