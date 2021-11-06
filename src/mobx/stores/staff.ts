import { STORE_STATES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import StaffService from '@mobx/services/staff';
import BaseStore from './base-store';
import { StaffModel, StaffRequestParams } from '@models/staff';
import { withProgress } from '@mobx/services/config';

@Service()
export default class StaffStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      staffs: observable,
      find: action,
    });
    void this.find();
  }

  private readonly staffService = Container.get(StaffService);

  staffs: Array<StaffModel> = [];

  /**
   * get a list of customer by keyword.
   * for manager uses only.
   * @param params for searching
   */
  public async find(params: StaffRequestParams = { keyword: '', isAvailable: true }) {
    this.startLoading();

    const { result, error } = await this.staffService.find(params);

    if (error) {
      this.handleError(error);
    } else {
      const staffs = result || [];
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.staffs = [...staffs];
      });
    }
  }

  public async update(staff: StaffModel) {
    this.startLoading();

    const { error } = await withProgress(this.staffService.updateStaff(staff));

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
