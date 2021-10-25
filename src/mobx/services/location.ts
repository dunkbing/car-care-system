import RNLocation from 'react-native-location';

class LocationService {
  public async requestPermission() {
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'fine',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
    }
    if (permission) {
      const location = await RNLocation.getLatestLocation({ timeout: 100 });
      return Promise.resolve(location);
    }
    return Promise.reject(new Error('Cannot get permission'));
  }
}

export default new LocationService();
