import { Gender, LoginQueryModel, User } from '@models/customer';
import { STATES } from '@utils/constants';

class AuthService {
  state: STATES = STATES.IDLE;
  user: User = {
    id: 1,
    email: 'email@example.com',
    address: 'address',
    accessToken: '123',
    accountStatus: 1,
    dateOfBirth: '01/01/2021',
    firstName: 'a',
    lastName: 'b',
    gender: Gender.Male,
    phoneNumber: '034958273',
  };

  public async login({ emailOrPhone }: LoginQueryModel) {
    if (emailOrPhone === '012345678') {
      return Promise.reject();
    } else if (!/\S+@\S+\.\S+/.test(emailOrPhone) && !/^[0-9()-]+$/.test(emailOrPhone)) {
      return Promise.reject();
    }
    return new Promise((resolve) => {
      console.log('Called mocked login');
      process.nextTick(() => resolve(this.user)); //Resolving the promise with the mocked list
    });
  }
}

export const authService = new AuthService();