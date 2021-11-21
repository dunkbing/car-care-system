import RNLocation from 'react-native-location';
import { Service } from 'typedi';

@Service()
export default class LocationService {
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
          detail: 'coarse',
          rationale: {
            title: 'Truy cập vị trí',
            message: 'Cho phép truy cập vị trí hiện tại của bạn',
            buttonPositive: 'Đồng ý',
            buttonNegative: 'Hủy',
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
