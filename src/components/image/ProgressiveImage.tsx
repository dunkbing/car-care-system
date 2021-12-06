import React from 'react';
import { Animated, ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8',
  },
});

interface ProgressiveImageProps {
  source: ImageSourcePropType;
  thumbnailSource: ImageSourcePropType;
  style: StyleProp<ImageStyle>;
  resizeMode: ImageResizeMode;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ source, thumbnailSource, style, resizeMode }) => {
  const thumbnailAnimated = new Animated.Value(0);
  const imageAnimated = new Animated.Value(0);

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={thumbnailSource}
        style={[style, { opacity: thumbnailAnimated }]}
        resizeMode={resizeMode}
        onLoad={handleThumbnailLoad}
        blurRadius={1}
      />
      <Animated.Image
        source={source}
        style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
        resizeMode={resizeMode}
        onLoad={onImageLoad}
      />
    </View>
  );
};

export default ProgressiveImage;
