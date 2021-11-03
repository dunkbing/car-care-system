import 'reflect-metadata';
import { STORE_STATES, USER_TYPES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import RescueService from '@mobx/services/rescue';
import { CustomerRescueHistoryModel, GarageRescueHistoryModel } from '@models/rescue';
import AuthStore from './auth';

@Service()
export default class RescueStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      customerRescueHistories: observable,
      garageRescueHistories: observable,
      find: action,
    });
    void this.find('');
  }

  private readonly garageService = Container.get(RescueService);
  private readonly authStore = Container.get(AuthStore);

  state: STORE_STATES = STORE_STATES.IDLE;
  customerRescueHistories: Array<CustomerRescueHistoryModel> = [];
  garageRescueHistories: Array<GarageRescueHistoryModel> = [];

  public async find(keyword: string, userType: USER_TYPES = USER_TYPES.CUSTOMER) {
    this.state = STORE_STATES.LOADING;

    if (userType === USER_TYPES.CUSTOMER) {
      const { result, error } = await this.garageService.findCustomerHistories(keyword);

      if (error) {
        runInAction(() => {
          this.state = STORE_STATES.ERROR;
        });
      } else {
        const rescues = result || [];
        runInAction(() => {
          this.state = STORE_STATES.SUCCESS;
          this.customerRescueHistories = [...rescues];
        });
      }
    } else {
      const { result, error } = await this.garageService.findGarageHistories(keyword);

      if (error) {
        runInAction(() => {
          this.state = STORE_STATES.ERROR;
        });
      } else {
        const rescues = result || [];
        runInAction(() => {
          this.state = STORE_STATES.SUCCESS;
          this.garageRescueHistories = [...rescues];
        });
      }
    }
  }
}
