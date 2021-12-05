import Container, { Service } from 'typedi';
import { action, makeObservable, observable, runInAction } from 'mobx';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
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
import { authApi, firestoreCollection } from '@mobx/services/api-types';

@Service()
export default class AuthStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      user: observable,
      userType: observable,
      login: action,
      register: action,
      logout: action,
    });
  }
  private readonly apiService = Container.get(ApiService);
  private readonly garageStore = Container.get(GarageStore);
  user: User | null = null;
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
      this.handleError(e);
    }
  }

  public async register(registerData: RegisterQueryModel) {
    const date = new Date(registerData.dateOfBirth);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const { error } = await this.apiService.post<RegisterResponseModel>(
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
      this.handleSuccess();
    }
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
  public async createNewPassword(verifyCode: string, password: string, confirmPassword: string) {
    this.startLoading();
    const { error } = await this.apiService.post(authApi.createNewPassword, { verifyCode, password, confirmPassword }, true);
    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  public logout() {
    runInAction(() => {
      this.user = null;
      this.state = STORE_STATUS.IDLE;
      this.userType = null;
      this.apiService.accessToken = null;
    });
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
