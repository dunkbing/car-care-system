import 'reflect-metadata';
import { STORE_STATES, USER_TYPES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import RescueService from '@mobx/services/rescue';
import { CustomerRescueHistoryModel, GarageRescueHistoryModel, RescueCase, RescueDetailRequest } from '@models/rescue';
import AuthStore from './auth';
import BaseStore from './base-store';
import { withProgress } from '@mobx/services/config';

@Service()
export default class RescueStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      customerRescueHistories: observable,
      garageRescueHistories: observable,
      find: action,
    });
    void this.find('');
  }

  private readonly rescueService = Container.get(RescueService);
  private readonly authStore = Container.get(AuthStore);

  customerRescueHistories: Array<CustomerRescueHistoryModel> = [];
  garageRescueHistories: Array<GarageRescueHistoryModel> = [];
  rescueCases: Array<RescueCase> = [];

  /**
   * get current user's rescue histories.
   * @param keyword
   * @param userType
   */
  public async find(keyword: string, userType: USER_TYPES = USER_TYPES.CUSTOMER) {
    this.state = STORE_STATES.LOADING;

    if (userType === USER_TYPES.CUSTOMER) {
      const { result, error } = await this.rescueService.find(keyword);

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
      const { result, error } = await this.rescueService.findGarageHistories(keyword);

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

  /**
   * get a list of common rescue cases.
   */
  public async getRescueCases() {
    this.startLoading();

    const { result, error } = await withProgress(this.rescueService.getRescueCases());

    if (error) {
      this.handleError(error);
    } else {
      const rescues = result || [];
      runInAction(() => {
        this.rescueCases = rescues;
      });
      this.handleSuccess();
    }
  }

  /**
   * create a rescue case.
   * @param rescueDetail
   */
  public async createRescueCase(rescueDetail: RescueDetailRequest) {
    this.startLoading();

    const { result, error } = await this.rescueService.createRescueDetail(rescueDetail);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.rescueCases.push(result);
      });
      this.handleSuccess();
    }
  }
}
