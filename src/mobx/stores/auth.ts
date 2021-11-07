import {
  CustomerLoginResponseModel,
  GarageLoginResponseModel,
  LoginQueryModel,
  RegisterQueryModel,
  RegisterResponseModel,
  User,
} from '@models/user';
import { STORE_STATES, USER_TYPES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { setHeader } from '@mobx/services/config';
import Container, { Service } from 'typedi';
import GarageStore from './garage';
import { ApiService } from '@mobx/services/api-service';
import BaseStore from './base-store';

const apiUrls = {
  customerLogin: 'auth/customers/login',
  garageLogin: 'auth/staffs/login',
  register: 'auth/register',
};

@Service()
export default class AuthStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      errorMessage: observable,
      user: observable,
      userType: observable,
      login: action,
      register: action,
      logout: action,
    });
  }
  private readonly apiService = Container.get(ApiService);
  private readonly garageStore = Container.get(GarageStore);
  state: STORE_STATES = STORE_STATES.IDLE;
  user: User | null = null;
  userType: USER_TYPES | undefined | null = USER_TYPES.CUSTOMER;

  public async login(loginQuery: LoginQueryModel, userType: USER_TYPES = USER_TYPES.CUSTOMER) {
    if (userType === USER_TYPES.CUSTOMER) {
      const { result: user, error } = await this.apiService.post<CustomerLoginResponseModel>(apiUrls.customerLogin, loginQuery, true);
      if (error) {
        runInAction(() => {
          this.user = null;
          this.state = STORE_STATES.ERROR;
        });
      } else {
        runInAction(() => {
          this.user = user;
          this.state = STORE_STATES.SUCCESS;
          this.userType = userType;
          this.apiService.accessToken = user?.accessToken;
          setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
        });
      }
    } else {
      const { result: user, error } = await this.apiService.post<GarageLoginResponseModel>(apiUrls.garageLogin, loginQuery, true);
      if (error) {
        runInAction(() => {
          this.user = null;
          this.state = STORE_STATES.ERROR;
        });
      } else {
        runInAction(() => {
          this.user = user;
          this.state = STORE_STATES.SUCCESS;
          this.userType = user?.accountType;
          this.garageStore.setGarage(user?.garage as any);
          setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
        });
      }
    }
  }

  public async register(registerData: RegisterQueryModel) {
    const { error } = await this.apiService.post<RegisterResponseModel>(apiUrls.register, registerData, true);
    if (error) {
      runInAction(() => {
        this.user = null;
        this.state = STORE_STATES.ERROR;
      });
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  public logout() {
    runInAction(() => {
      this.user = null;
      this.state = STORE_STATES.IDLE;
      this.userType = null;
      this.apiService.accessToken = null;
    });
  }
}
