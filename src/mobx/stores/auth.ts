import { LoginQueryModel, User } from '@models/customer';
import AuthService from '@mobx/services/auth';
import { STATES } from '@utils/constants';
import { makeObservable, observable, runInAction } from 'mobx';
import { setHeader, withProgress } from '@mobx/services/config';
import Container, { Service } from 'typedi';

@Service()
export default class AuthStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      user: observable,
    });
  }
  private readonly authService = Container.get(AuthService);
  state: STATES = STATES.IDLE;
  user: User | null = null;

  public async login(loginQuery: LoginQueryModel) {
    const { result: user, error } = await withProgress(this.authService.login(loginQuery));
    if (error) {
      runInAction(() => {
        this.user = null;
        this.state = STATES.ERROR;
      });
    } else
      runInAction(() => {
        this.user = user;
        this.state = STATES.SUCCESS;
        setHeader('Authorization', `Bearer ${this.user?.accessToken as string}`);
      });
  }
}
