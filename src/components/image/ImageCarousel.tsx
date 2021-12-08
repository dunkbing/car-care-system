import React, { useState } from 'react';
import { ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { ScrollView, View } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer-fixed';
import ProgressiveImage from './ProgressiveImage';
import { NoImage } from '@assets/images';

const ImageCarousel: React.FC<{
  imageUrls: string[];
  removable?: boolean;
  deleteDisabled?: boolean;
  onDeleteImage?: (index: number) => void;
}> = ({ imageUrls, removable, deleteDisabled, onDeleteImage }) => {
  const [imageViewState, setImageViewState] = useState({
    visible: false,
    index: 0,
  });

  return (
    <View>
      <ScrollView horizontal m='1.5' contentContainerStyle={{ flexGrow: 1, paddingRight: 50 }}>
        {imageUrls.map((uri, index) =>
          removable ? (
            <View key={`${index}`} style={{ width: 60, height: 60, margin: 5 }}>
              <TouchableOpacity
                style={{ flex: 1, borderRadius: 5, width: 60, height: 60 }}
                onPress={() => {
                  setImageViewState({ visible: true, index });
                }}
              >
                <ProgressiveImage source={{ uri }} thumbnailSource={{ uri }} style={{ width: 60, height: 60 }} resizeMode='cover' />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  margin: 1,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
                onPress={() => {
                  // remove image at index
                  onDeleteImage?.(index);
                }}
                disabled={deleteDisabled}
              >
                <Ionicons name='close-circle-sharp' color={deleteDisabled ? 'grey' : 'red'} size={15} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity key={`${index}`} style={{ marginLeft: 10 }} onPress={() => setImageViewState({ index, visible: true })}>
              <ProgressiveImage source={{ uri }} thumbnailSource={{ uri }} style={{ width: 60, height: 60 }} resizeMode='cover' />
            </TouchableOpacity>
          ),
        )}
      </ScrollView>
      <Modal
        visible={imageViewState.visible}
        onRequestClose={() => {
          setImageViewState({
            visible: false,
            index: 0,
          });
        }}
      >
        <ImageViewer
          backgroundColor='#000'
          imageUrls={imageUrls.map((url) => ({ url }))}
          enableSwipeDown
          swipeDownThreshold={100}
          onSwipeDown={() => {
            setImageViewState({ ...imageViewState, visible: false });
          }}
          index={imageViewState.index}
          renderIndicator={() => <ActivityIndicator />}
          failImageSource={NoImage}
          loadingRender={() => <ActivityIndicator />}
        />
      </Modal>
    </View>
  );
};

export default ImageCarousel;
