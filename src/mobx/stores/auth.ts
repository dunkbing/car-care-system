import { LoginQueryModel, User } from '@models/customer';
import AuthService from '@mobx/services/auth';
import { STATES, USER_TYPES } from '@utils/constants';
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
  // private readonly garageStore = Container.get(GarageStore);
  state: STATES = STATES.IDLE;
  user: User | null = null;
  userType: USER_TYPES = USER_TYPES.CUSTOMER;

  public async login(loginQuery: LoginQueryModel, userType: USER_TYPES = USER_TYPES.CUSTOMER) {
    const { result: user, error } = await withProgress(this.authService.login(loginQuery));
    if (error) {
      runInAction(() => {
        this.user = null;
        this.state = STATES.ERROR;
      });
    } else {
      // if (user?.defaultGarageId) {
      //   void this.garageStore.getOne(user.defaultGarageId);
      // }
      runInAction(() => {
        this.user = user;
        this.state = STATES.SUCCESS;
        this.userType = userType;
        setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
      });
    }
  }

  public logout() {
    runInAction(() => {
      this.user = null;
      this.state = STATES.IDLE;
    });
  }
}
