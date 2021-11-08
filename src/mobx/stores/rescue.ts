import 'reflect-metadata';
import { STORE_STATUS, ACCOUNT_TYPES, RESCUE_STATUS } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import {
  AvailableCustomerRescueDetail,
  RescueState,
  CustomerRescueHistoryModel,
  GarageRescueHistoryModel,
  RescueCase,
  RescueDetailRequest,
  RejectCase,
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
  assignStaff: 'rescues/details/assign-staff',
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
      currentCustomerProcessingRescue: observable,
      currentStaffProcessingRescue: observable,
      garageRescueHistories: observable,
      pendingRescueRequests: observable,
      rescueCases: observable,
      customerRejectedCases: observable,
      currentStaffRescueState: observable,
      findHistories: action,
      createRescueDetail: action,
      assignStaff: action,
      changeRescueStatusToArriving: action,
      changeRescueStatusToArrived: action,
      changeRescueStatusToWorking: action,
      changeRescueStatusToDone: action,
      customerRejectCurrentRescueCase: action,
      getCurrentProcessingCustomer: action,
      getCurrentProcessingStaff: action,
      getCustomerRejectRescueCases: action,
      getGarageRejectRescueCases: action,
      getPendingRescueRequests: action,
      getRescueCases: action,
    });
    void this.findHistories('');
  }

  private readonly apiService = Container.get(ApiService);

  customerRescueHistories: Array<CustomerRescueHistoryModel> = [];
  currentCustomerProcessingRescue: AvailableCustomerRescueDetail | null = null;
  currentStaffProcessingRescue: AvailableCustomerRescueDetail | null = null;
  currentStaffRescueState: RescueState | null = null;

  garageRescueHistories: Array<GarageRescueHistoryModel> = [];
  rescueCases: Array<RescueCase> = [];
  pendingRescueRequests: Array<AvailableCustomerRescueDetail> = [];

  customerRejectedCases: Array<RejectCase> = [];

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
  public async getCurrentProcessingStaff() {
    this.startLoading();
    const { result, error } = await this.apiService.get<any>(apiUrls.currentProcessingGarage, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.currentStaffProcessingRescue = result;
      });
      this.handleSuccess();
    }
  }

  /**
   * assign staff to rescue detail.
   */
  public async assignStaff(params: { staffId: number; rescueDetailId: number }) {
    console.log(params);
    this.startLoading();
    const { result, error } = await this.apiService.patch<any>(apiUrls.assignStaff, params, true);
    console.log(result, error);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to arriving
   */
  public async changeRescueStatusToArriving(params: { status: RESCUE_STATUS; estimatedArrivalTime: number }) {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.arrivingRescue, params, true);

    if (error) {
      this.handleError(error);
    } else {
      this.currentStaffRescueState = { currentStatus: params.status, estimatedArrivalTime: params.estimatedArrivalTime };
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to arrived rescue
   */
  public async changeRescueStatusToArrived() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.arrivedRescue, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      this.currentStaffRescueState = { currentStatus: RESCUE_STATUS.ARRIVED, estimatedArrivalTime: 0 };
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to working
   */
  public async changeRescueStatusToWorking() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.workingRescue, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * change current rescue detail's status to done
   */
  public async changeRescueStatusToDone() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(apiUrls.doneRescue, {}, true);

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

    const { error, result } = await this.apiService.getPlural<RejectCase>(apiUrls.customerRejectedCases, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      const cases = result || [];
      runInAction(() => {
        this.customerRejectedCases = [...cases] || [];
      });
      this.handleSuccess();
    }
  }

  /**
   * customer reject current rescue case
   */
  public async customerRejectCurrentRescueCase(params: { rejectRescueCaseId: number; rejectReason: string }) {
    this.startLoading();

    const { error } = await this.apiService.patch<any>(apiUrls.customerRejectCurrentCase, params, true);
    console.log(error, params);

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
