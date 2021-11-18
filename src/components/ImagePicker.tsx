import React from 'react';
import { Center, HStack, Text, VStack } from 'native-base';
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
export default function ImagePicker({ onSelectImage }: Props) {
  const choosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
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
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets?.length) {
        onSelectImage(response.assets[0]);
      }
    });
  };

  return (
    <Center h={100} backgroundColor='white'>
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
    </Center>
  );
}
