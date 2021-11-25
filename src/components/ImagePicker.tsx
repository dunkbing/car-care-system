import React from 'react';
import { HStack, Modal, Text, VStack } from 'native-base';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';

type Props = {
  onSelectImage: (images: Asset) => void;
};

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Cho phép chuy cập',
        message: 'Cho phép chuy cập camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      });
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else return true;
};

const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: '',
        message: 'Cho phép chuy cập bộ nhớ',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      });
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
    }
    return false;
  } else return true;
};

/**
 * a component that allows the user to choose an image from their device or take a new one
 */
function ImagePicker({ onSelectImage }: Props) {
  const choosePhoto = () => {
    void launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets?.length) {
        onSelectImage(response.assets[0]);
      }
    });
  };

  const takePhoto = async () => {
    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();
    if (!isCameraPermitted || !isStoragePermitted) {
      return;
    }
    void launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets?.length) {
        onSelectImage(response.assets[0]);
      }
    });
  };

  return (
    <VStack space={2} pt={4} pb={2}>
      <HStack space={2}>
        <MatIcon name='image' size={30} />
        <TouchableOpacity onPress={choosePhoto}>
          <Text fontSize='lg'>Chọn ảnh từ thư viện</Text>
        </TouchableOpacity>
      </HStack>
      <HStack space={2}>
        <MatIcon name='photo-camera' size={30} />
        <TouchableOpacity onPress={takePhoto}>
          <Text fontSize='lg'>Chụp ảnh mới</Text>
        </TouchableOpacity>
      </HStack>
    </VStack>
  );
}

export default class ImagePickerWrapper extends React.Component<Props, { isOpen: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  public open() {
    this.setState({ isOpen: true });
  }

  render() {
    return (
      <Modal isOpen={this.state.isOpen} onClose={() => this.setState({ isOpen: false })} size='lg'>
        <Modal.Content maxWidth='80%'>
          <Modal.Body>
            <ImagePicker
              onSelectImage={(image: Asset) => {
                this.props.onSelectImage(image);
                this.setState({ isOpen: false });
              }}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  }
}
