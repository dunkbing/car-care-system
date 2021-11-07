import 'reflect-metadata';
import { STORE_STATUS, ACCOUNT_TYPES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import {
  AvailableCustomerRescueDetail,
  CustomerRescueHistoryModel,
  GarageRescueHistoryModel,
  RescueCase,
  RescueDetailRequest,
} from '@models/rescue';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';

const apiUrls = {
  customerHistories: 'rescues/histories/customer',
  garageHistories: 'rescues/histories/garage',
  cases: 'rescues/cases',
  createRescueDetail: 'rescues/details',
  currentProcessingCustomer: 'rescues/available-details/customer',
  currentProcessingGarage: 'rescues/available-details/staff',
  assignStaff: (id: number) => `rescues/details/assign-staff/${id}`,
  arrivingRescue: 'rescues/details/arriving-rescue',
  arrivedRescue: 'rescues/details/arrived-rescue',
  workingRescue: 'rescues/details/working-rescue',
  doneRescue: 'rescues/details/done-rescue',
  pendingDetails: 'rescues/pending-details',
  customerRejectedCases: 'rescues/reject-cases/customers',
  customerRejectCurrentCase: 'rescues/reject-cases/customers',
  garageRejectedCases: 'rescues/reject-cases/garages',
};

@Service()
export default class RescueStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      errorMessage: observable,
      customerRescueHistories: observable,
      garageRescueHistories: observable,
      pendingRescueRequests: observable,
      rescueCases: observable,
      findHistories: action,
      createRescueDetail: action,
      getPendingRescueRequests: action,
      getRescueCases: action,
    });
    void this.findHistories('');
  }

  private readonly apiService = Container.get(ApiService);

  customerRescueHistories: Array<CustomerRescueHistoryModel> = [];
  currentCustomerProcessingRescue: AvailableCustomerRescueDetail | null = null;

  garageRescueHistories: Array<GarageRescueHistoryModel> = [];
  rescueCases: Array<RescueCase> = [];
  pendingRescueRequests: Array<AvailableCustomerRescueDetail> = [];

  /**
   * get current user's rescue histories.
   * @param keyword
   * @param userType
   */
  public async findHistories(keyword: string, userType: ACCOUNT_TYPES = ACCOUNT_TYPES.CUSTOMER) {
    this.state = STORE_STATUS.LOADING;

    if (userType === ACCOUNT_TYPES.CUSTOMER) {
      const { result, error } = await this.apiService.getPluralWithPagination<CustomerRescueHistoryModel>(apiUrls.customerHistories, {
        keyword,
      });

      if (error) {
        runInAction(() => {
          this.state = STORE_STATUS.ERROR;
        });
      } else {
        const rescues = result || [];
        runInAction(() => {
          this.state = STORE_STATUS.SUCCESS;
          this.customerRescueHistories = [...rescues];
        });
      }
    } else {
      const { result, error } = await this.apiService.getPluralWithPagination<GarageRescueHistoryModel>(apiUrls.garageHistories, {
        keyword,
      });

      if (error) {
        runInAction(() => {
          this.state = STORE_STATUS.ERROR;
        });
      } else {
        const rescues = result || [];
        runInAction(() => {
          this.state = STORE_STATUS.SUCCESS;
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

    const { result, error } = await this.apiService.getPlural<RescueCase>(apiUrls.cases, {}, true);

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
  public async createRescueDetail(rescueDetail: RescueDetailRequest) {
    this.startLoading();

    const { result, error } = await this.apiService.post<any>(apiUrls.createRescueDetail, rescueDetail);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.rescueCases.push(result);
      });
      this.handleSuccess();
    }
  }

  /**
   * get current available customer's processing rescue detail
   */
  public async getCurrentProcessingCustomer() {
    this.startLoading();
    const { result, error } = await this.apiService.get<AvailableCustomerRescueDetail>(apiUrls.currentProcessingCustomer);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.currentCustomerProcessingRescue = result;
      });
      this.handleSuccess();
    }
  }

  /**
   * get current available staff's processing rescue detail
   */
  public async getCurrentProcessingGarage() {
    this.startLoading();
    const { result, error } = await this.apiService.get<any>(apiUrls.currentProcessingGarage);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.currentCustomerProcessingRescue = result;
      });
      this.handleSuccess();
    }
  }

  /**
   * assign staff to rescue detail.
   */
  public async assignStaff(staffId: number) {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.assignStaff(staffId));

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to arriving
   */
  public async changeStatusToArriving() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.arrivingRescue);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to arrived rescue
   */
  public async changeStatusToArrivedRescue() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.arrivedRescue);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to working
   */
  public async changeStatusToWorking() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.workingRescue);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to done
   */
  public async changeStatusToDone() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.doneRescue);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * get pending rescue requests
   */
  public async getPendingRescueRequests() {
    this.startLoading();

    const { result, error } = await this.apiService.getPlural<AvailableCustomerRescueDetail>(apiUrls.pendingDetails);

    if (error) {
      this.handleError(error);
    } else {
      const requests = result || [];
      runInAction(() => {
        this.pendingRescueRequests = [...requests];
      });
      this.handleSuccess();
    }
  }

  /**
   * get all reject rescue cases customer side
   */
  public async getCustomerRejectRescueCases() {
    this.startLoading();

    const { error } = await this.apiService.get<any>(apiUrls.customerRejectedCases);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * customer reject current rescue case
   */
  public async customerRejectCurrentRescueCase() {
    this.startLoading();

    const { error } = await this.apiService.patch<any>(apiUrls.customerRejectCurrentCase);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * get all reject rescue cases garage side
   */
  public async getGarageRejectRescueCases() {
    this.startLoading();

    const { error } = await this.apiService.get<any>(apiUrls.garageRejectedCases);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
