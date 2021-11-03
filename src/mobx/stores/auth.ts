import { LoginQueryModel, User } from '@models/user';
import AuthService from '@mobx/services/auth';
import { STORE_STATES, USER_TYPES } from '@utils/constants';
import { makeObservable, observable, runInAction } from 'mobx';
import { setHeader, withProgress } from '@mobx/services/config';
import Container, { Service } from 'typedi';
import GarageStore from './garage';

@Service()
export default class AuthStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      user: observable,
    });
  }
  private readonly authService = Container.get(AuthService);
  private readonly garageStore = Container.get(GarageStore);
  state: STORE_STATES = STORE_STATES.IDLE;
  user: User | null = null;
  userType: USER_TYPES | undefined | null = USER_TYPES.CUSTOMER;

  public async login(loginQuery: LoginQueryModel, userType: USER_TYPES = USER_TYPES.CUSTOMER) {
    if (userType === USER_TYPES.CUSTOMER) {
      const { result: user, error } = await withProgress(this.authService.customerLogin(loginQuery));
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
          setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
        });
      }
    } else {
      const { result: user, error } = await withProgress(this.authService.garageLogin(loginQuery));
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

  public logout() {
    runInAction(() => {
      this.user = null;
      this.state = STORE_STATES.IDLE;
      this.userType = null;
    });
  }
}
