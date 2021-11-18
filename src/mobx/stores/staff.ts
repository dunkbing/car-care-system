import { STORE_STATUS } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import StaffService from '@mobx/services/staff';
import BaseStore from './base-store';
import { CreateStaffModel, StaffModel, StaffRequestParams } from '@models/staff';
import { withProgress } from '@mobx/services/config';
import { ApiService } from '@mobx/services/api-service';
import { staffApi } from '@mobx/services/api-types';

@Service()
export default class StaffStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      staffs: observable,
      getMany: action,
    });
    void this.getMany();
  }

  private readonly staffService = Container.get(StaffService);
  private readonly apiService = Container.get(ApiService);

  staffs: Array<StaffModel> = [];

  /**
   * get a list of customer by keyword.
   * for manager uses only.
   * @param params for searching
   */
  public async getMany(params: StaffRequestParams = { keyword: '' }) {
    this.startLoading();

    const { result, error } = await this.staffService.find(params);

    if (error) {
      this.handleError(error);
    } else {
      const staffs = result || [];
      runInAction(() => {
        this.state = STORE_STATUS.SUCCESS;
        this.staffs = [...staffs];
      });
    }
  }

  /**
   * create a new staff
   */
  public async create(staff: CreateStaffModel) {
    this.startLoading();

    const { error } = await this.apiService.post(staffApi.create, staff, true, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * update a staff
   * @param staff
   */
  public async update(staff: StaffModel) {
    this.startLoading();

    const { error } = await withProgress(this.apiService.put(staffApi.managerUpdate, staff, true, true));

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  public async delete(id: number) {
    this.startLoading();

    const { error } = await this.apiService.delete(staffApi.delete(id), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
