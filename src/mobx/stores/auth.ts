import { LoginQueryModel, User } from '@models/customer';
import { authService } from '@mobx/services/auth';
import { STATES } from '@utils/constants';
import { makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';

class AuthStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      user: observable,
    });
  }
  state: STATES = STATES.IDLE;
  user: User | null = null;

  public async login(loginQuery: LoginQueryModel) {
    const { result: user, error } = await authService.login(loginQuery);
    if (error) {
      runInAction(() => {
        this.user = null;
        this.state = STATES.ERROR;
      });
    } else
      runInAction(() => {
        this.user = user;
        this.state = STATES.SUCCESS;
      });
  }
}

export { AuthStore };

export default createContext(new AuthStore());
