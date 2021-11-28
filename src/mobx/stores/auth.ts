import {
  CustomerLoginResponseModel,
  GarageLoginResponseModel,
  LoginQueryModel,
  RegisterQueryModel,
  RegisterResponseModel,
  User,
} from '@models/user';
import { STORE_STATUS, ACCOUNT_TYPES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { setHeader } from '@mobx/services/config';
import Container, { Service } from 'typedi';
import GarageStore from './garage';
import { ApiService } from '@mobx/services/api-service';
import BaseStore from './base-store';
import { authApi } from '@mobx/services/api-types';

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
    if (userType === ACCOUNT_TYPES.CUSTOMER) {
      const { result: user, error } = await this.apiService.post<CustomerLoginResponseModel>(authApi.customerLogin, loginQuery, true);
      if (error) {
        this.handleError(error);
      } else {
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
  }

  public async register(registerData: RegisterQueryModel) {
    console.log(registerData);
    const { error } = await this.apiService.post<RegisterResponseModel>(authApi.register, registerData, true, true);
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

  public logout() {
    runInAction(() => {
      this.user = null;
      this.state = STORE_STATUS.IDLE;
      this.userType = null;
      this.apiService.accessToken = null;
    });
  }
}
