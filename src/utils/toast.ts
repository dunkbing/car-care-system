import { Platform, ToastAndroid, Alert } from 'react-native';

export default {
  show(message: string, duration?: number) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, duration === undefined ? ToastAndroid.SHORT : duration);
    } else {
      Alert.alert(message);
    }
  },
};
