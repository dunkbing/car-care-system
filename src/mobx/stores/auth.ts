import Container, { Service } from 'typedi';
import { action, makeObservable, observable, runInAction } from 'mobx';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CustomerLoginResponseModel,
  GarageLoginResponseModel,
  LoginQueryModel,
  RegisterQueryModel,
  RegisterResponseModel,
  User,
} from '@models/user';
import { STORE_STATUS, ACCOUNT_TYPES } from '@utils/constants';
import { setHeader, withProgress } from '@mobx/services/config';
import GarageStore from './garage';
import { ApiService } from '@mobx/services/api-service';
import BaseStore from './base-store';
import { authApi, customerApi, firestoreCollection } from '@mobx/services/api-types';
import { log } from '@utils/logger';

@Service()
export default class AuthStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      user: observable,
      registeredUser: observable,
      userType: observable,
      login: action,
      register: action,
      logout: action,
    });
  }
  private readonly apiService = Container.get(ApiService);
  private readonly garageStore = Container.get(GarageStore);
  user: User | null = null;
  registeredUser: (LoginQueryModel & { garageId?: number }) | null = null;
  userType: ACCOUNT_TYPES | undefined | null = ACCOUNT_TYPES.CUSTOMER;

  public async login(loginQuery: LoginQueryModel, userType: ACCOUNT_TYPES = ACCOUNT_TYPES.CUSTOMER) {
    try {
      const token = await messaging().getToken();
      if (userType === ACCOUNT_TYPES.CUSTOMER) {
        const { result: user, error } = await this.apiService.post<CustomerLoginResponseModel>(authApi.customerLogin, loginQuery, true);
        if (error) {
          this.handleError(error);
        } else {
          await withProgress(
            firestore().collection(firestoreCollection.customerDeviceTokens).doc(`${user?.id}`).set(
              {
                token,
              },
              { merge: true },
            ),
          );
          runInAction(() => {
            this.user = user;
            this.state = STORE_STATUS.SUCCESS;
            this.userType = userType;
            this.apiService.accessToken = user?.accessToken;
            setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
          });
        }
      } else {
        const { result: user, error } = await this.apiService.post<GarageLoginResponseModel>(authApi.garageLogin, loginQuery, true);
        if (error) {
          this.handleError(error);
        } else {
          const collection =
            user?.accountType === ACCOUNT_TYPES.GARAGE_MANAGER
              ? firestoreCollection.managerDeviceTokens
              : firestoreCollection.staffDeviceTokens;
          const doc = user?.accountType === ACCOUNT_TYPES.GARAGE_MANAGER ? user?.garage?.id : user?.id;
          await withProgress(
            firestore().collection(collection).doc(`${doc}`).set(
              {
                token,
              },
              { merge: true },
            ),
          );
          runInAction(() => {
            this.user = user;
            this.state = STORE_STATUS.SUCCESS;
            this.userType = user?.accountType;
            this.garageStore.setGarage(user?.garage as any);
            this.apiService.accessToken = user?.accessToken;
            setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
          });
        }
      }
    } catch (e) {
      console.log(e);
      this.handleError(e);
    }
  }

  public async saveToLocal(user: any, side: 'customer' | 'garage') {
    await AsyncStorage.setItem('@auth:user', JSON.stringify(user));
    await AsyncStorage.setItem('@auth:userSide', JSON.stringify({ userSide: side }));
  }

  public async customerLoginAfterRegister() {
    const { result: user, error } = await this.apiService.post<CustomerLoginResponseModel>(
      authApi.customerLogin,
      this.registeredUser,
      true,
    );
    if (error) {
      this.handleError(error);
    } else {
      const token = await messaging().getToken();
      await withProgress(
        firestore().collection(firestoreCollection.customerDeviceTokens).doc(`${user?.id}`).set(
          {
            token,
          },
          { merge: true },
        ),
      );
      runInAction(() => {
        this.user = user;
        this.state = STORE_STATUS.SUCCESS;
        this.userType = ACCOUNT_TYPES.CUSTOMER;
        this.apiService.accessToken = user?.accessToken;
        setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
      });
      await withProgress(this.apiService.patch(customerApi.setDefaultGarage, { garageId: this.registeredUser?.garageId }, true));
    }
  }

  public async register(registerData: RegisterQueryModel) {
    const date = new Date(registerData.dateOfBirth);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const { error, result } = await this.apiService.post<RegisterResponseModel>(
      authApi.register,
      { ...registerData, dateOfBirth: `${year}/${month}/${day}` },
      true,
      true,
    );
    if (error) {
      runInAction(() => {
        this.user = null;
        this.userType = null;
      });
      this.handleError(error);
    } else {
      runInAction(() => {
        this.registeredUser = {
          emailOrPhone: registerData.email || registerData.phoneNumber,
          password: registerData.password,
        };
        this.apiService.accessToken = result?.accessToken;
      });
      this.handleSuccess();
    }
  }

  public selectGarage(garageId: number) {
    runInAction(() => {
      this.registeredUser = {
        ...this.registeredUser,
        garageId,
      } as any;
    });
  }

  // send verification code
  public async sendVerificationCode(email: string) {
    this.startLoading();
    const { error } = await this.apiService.post(authApi.sendCode, { email }, true);
    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  // verify code
  public async verifyCode(emailOrPhone: string, verificationCode: string) {
    this.startLoading();
    const { error } = await this.apiService.post(authApi.verifyCode, { emailOrPhone, verificationCode }, true);
    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  // create new password
  public async createNewPassword(emailOrPhone: string, password: string, confirmPassword: string) {
    this.startLoading();
    log.info('createNewPassword', emailOrPhone, password, confirmPassword);
    const { error } = await this.apiService.post(authApi.createNewPassword, { emailOrPhone, password, confirmPassword }, true);
    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  public logout() {
    runInAction(() => {
      this.user = null;
      this.registeredUser = null;
      this.state = STORE_STATUS.IDLE;
      this.userType = null;
      this.apiService.accessToken = null;
    });
    void AsyncStorage.removeItem('@auth:user');
    void AsyncStorage.removeItem('@auth:userSide');
  }

  public async getDetail() {
    this.startLoading();

    try {
      const { result, error } = await this.apiService.get('customers', {}, true);

      if (error) {
        this.handleError(error);
      } else {
        runInAction(() => {
          this.user = result as any;
          this.state = STORE_STATUS.SUCCESS;
        });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
    }
  }
}
