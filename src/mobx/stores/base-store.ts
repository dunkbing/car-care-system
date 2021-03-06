import { STORE_STATUS } from '@utils/constants';
import { log } from '@utils/logger';
import { makeObservable, observable, runInAction } from 'mobx';

export default class BaseStore {
  state: STORE_STATUS = STORE_STATUS.IDLE;
  errorMessage = '';

  constructor() {
    makeObservable(this, {
      state: observable,
      errorMessage: observable,
    });
  }

  protected handleError(error: Error | any) {
    log.error(error);
    runInAction(() => {
      this.state = STORE_STATUS.ERROR;
    });
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
        if (error.message) {
          this.errorMessage = `Có lỗi xảy ra: ${error.message}`;
        } else {
          this.errorMessage = JSON.stringify(error);
        }
      });
    }
  }

  protected handleSuccess() {
    runInAction(() => {
      this.state = STORE_STATUS.SUCCESS;
      this.errorMessage = '';
    });
  }

  protected startLoading() {
    runInAction(() => {
      this.state = STORE_STATUS.LOADING;
      this.errorMessage = '';
    });
  }
}
