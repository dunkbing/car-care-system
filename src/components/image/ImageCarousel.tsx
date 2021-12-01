import { ScrollView, View } from 'native-base';
import React, { useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer-fixed';
import ProgressiveImage from './ProgressiveImage';

const ImageCarousel: React.FC<{ imageUrls: string[] }> = ({ imageUrls }) => {
  const [imageViewState, setImageViewState] = useState({
    visible: false,
    index: 0,
  });

  return (
    <View>
      <ScrollView horizontal m='1.5'>
        {imageUrls.map((uri, index) => (
          <TouchableOpacity key={`${index}`} style={{ marginLeft: 10 }} onPress={() => setImageViewState({ index, visible: true })}>
            <ProgressiveImage source={{ uri }} thumbnailSource={{ uri }} style={{ width: 60, height: 60 }} resizeMode='cover' />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={imageViewState.visible}>
        <ImageViewer
          backgroundColor='#000'
          imageUrls={imageUrls.map((url) => ({ url }))}
          enableSwipeDown
          swipeDownThreshold={100}
          onSwipeDown={() => {
            setImageViewState({ ...imageViewState, visible: false });
          }}
          index={imageViewState.index}
        />
      </Modal>
    </View>
  );
};

export default ImageCarousel;
