import { STORE_STATUS } from '@utils/constants';
import { runInAction } from 'mobx';

export default class BaseStore {
  state: STORE_STATUS = STORE_STATUS.IDLE;
  errorMessage = '';

  protected handleError(error: Error | any) {
    this.state = STORE_STATUS.ERROR;
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
