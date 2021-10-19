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
    try {
      const user = await authService.login(loginQuery);
      runInAction(() => {
        this.user = user;
        this.state = STATES.SUCCESS;
      });
    } catch (error) {
      this.state = STATES.ERROR;
    }
  }
}

export { AuthStore };

export default createContext(new AuthStore());
