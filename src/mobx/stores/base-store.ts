import { STORE_STATES } from '@utils/constants';
import { runInAction } from 'mobx';

export default class BaseStore {
  state: STORE_STATES = STORE_STATES.IDLE;
  errorMessage = '';

  protected handleError(error: Error | any) {
    this.state = STORE_STATES.ERROR;
    if (Array.isArray(error)) {
      if (error.length > 0) {
        if (error[0].message) {
          runInAction(() => {
            this.errorMessage = error.map((e) => e.message).join('\n');
          });
        }
      }
    } else {
      runInAction(() => {
        this.errorMessage = `Có lỗi xảy ra: ${error.message}`;
      });
    }
  }

  protected handleSuccess() {
    runInAction(() => {
      this.state = STORE_STATES.SUCCESS;
      this.errorMessage = '';
    });
  }

  protected startLoading() {
    runInAction(() => {
      this.state = STORE_STATES.LOADING;
      this.errorMessage = '';
    });
  }
}
