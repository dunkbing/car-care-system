import 'reflect-metadata';
import { STORE_STATUS, ACCOUNT_TYPES, RESCUE_STATUS } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import {
  AvailableCustomerRescueDetail,
  RescueState,
  CustomerRescueHistory,
  GarageRescueHistory,
  RescueCase,
  RescueDetailRequest,
  RejectCase,
} from '@models/rescue';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { rescueApi } from '@mobx/services/api-types';
import FirebaseStore from './firebase';

@Service()
export default class RescueStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      customerRescueHistories: observable,
      currentCustomerProcessingRescue: observable,
      currentStaffProcessingRescue: observable,
      garageRescueHistories: observable,
      pendingRescueRequests: observable,
      rescueCases: observable,
      customerRejectedCases: observable,
      currentStaffRescueState: observable,
      getHistories: action,
      createRescueDetail: action,
      assignStaff: action,
      changeRescueStatusToArriving: action,
      changeRescueStatusToArrived: action,
      changeRescueStatusToWorking: action,
      customerRejectCurrentRescueCase: action,
      garageRejectCurrentRescueCase: action,
      getCurrentProcessingCustomer: action,
      getCurrentProcessingStaff: action,
      getCustomerRejectedRescueCases: action,
      getGarageRejectedRescueCases: action,
      getPendingRescueRequests: action,
      getRescueCases: action,
    });
    void this.getHistories('');
  }

  private readonly apiService = Container.get(ApiService);
  private readonly firebaseStore = Container.get(FirebaseStore);

  customerRescueHistories: Array<CustomerRescueHistory> = [];
  currentCustomerProcessingRescue: AvailableCustomerRescueDetail | null = null;
  currentStaffProcessingRescue: AvailableCustomerRescueDetail | null = null;
  currentStaffRescueState: RescueState | null = null;

  garageRescueHistories: Array<GarageRescueHistory> = [];
  rescueCases: Array<RescueCase> = [];
  pendingRescueRequests: Array<AvailableCustomerRescueDetail> = [];

  customerRejectedCases: Array<RejectCase> = [];
  garageRejectedCases: Array<RejectCase> = [];

  public setCurrentCustomerProcessingRescue(rescue: AvailableCustomerRescueDetail) {
    runInAction(() => {
      this.currentCustomerProcessingRescue = { ...rescue };
    });
  }

  public setCurrentStaffProcessingRescue(rescue: AvailableCustomerRescueDetail) {
    runInAction(() => {
      this.currentStaffProcessingRescue = { ...rescue };
    });
  }

  /**
   * get current user's rescue histories.
   * @param keyword
   * @param userType
   */
  public async getHistories(keyword: string, userType: ACCOUNT_TYPES = ACCOUNT_TYPES.CUSTOMER) {
    this.state = STORE_STATUS.LOADING;

    if (userType === ACCOUNT_TYPES.CUSTOMER) {
      const { result, error } = await this.apiService.getPluralWithPagination<CustomerRescueHistory>(rescueApi.customerHistories, {
        keyword,
      });

      if (error) {
        this.handleError(error);
      } else {
        const rescues = result || [];
        runInAction(() => {
          this.state = STORE_STATUS.SUCCESS;
          this.customerRescueHistories = [...rescues];
        });
      }
    } else {
      const { result, error } = await this.apiService.getPluralWithPagination<GarageRescueHistory>(rescueApi.garageHistories, {
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

    const { result, error } = await this.apiService.getPlural<RescueCase>(rescueApi.cases, {}, true);

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

    const { result, error } = await this.apiService.post<AvailableCustomerRescueDetail>(rescueApi.createRescueDetail, rescueDetail, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      await this.firebaseStore.set(`${result?.id}`, { status: RESCUE_STATUS.PENDING });
    }
  }

  /**
   * get current available customer's processing rescue detail
   */
  public async getCurrentProcessingCustomer() {
    this.startLoading();
    const { result, error } = await this.apiService.get<AvailableCustomerRescueDetail>(rescueApi.currentProcessingCustomer, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.currentCustomerProcessingRescue = result;
      });
      this.handleSuccess();

      if (this.currentCustomerProcessingRescue) {
        if (!this.firebaseStore.rescueDoc) {
          this.firebaseStore.rescueDoc = this.firebaseStore.rescuesRef.doc(`${this.currentCustomerProcessingRescue.id}`);
        }
        await this.firebaseStore
          .update(`${this.currentCustomerProcessingRescue?.id}`, { status: this.currentCustomerProcessingRescue?.status })
          .catch(console.error);
      }
    }
  }

  /**
   * get current available staff's processing rescue detail
   */
  public async getCurrentProcessingStaff(loading = true) {
    this.startLoading();
    const { result, error } = await this.apiService.get<any>(rescueApi.currentProcessingGarage, {}, loading);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.currentStaffProcessingRescue = result;
      });
      this.handleSuccess();
      if (this.currentStaffProcessingRescue) {
        if (!this.firebaseStore.rescueDoc) {
          this.firebaseStore.rescueDoc = this.firebaseStore.rescuesRef.doc(`${this.currentStaffProcessingRescue.id}`);
        }
        await this.firebaseStore
          .update(`${this.currentStaffProcessingRescue?.id}`, { status: this.currentStaffProcessingRescue?.status })
          .catch((error) => this.handleError(error));
      }
    }
  }

  /**
   * assign staff to rescue detail.
   */
  public async assignStaff(params: { staffId: number; rescueDetailId: number }) {
    this.startLoading();
    const { result, error } = await this.apiService.patch<{ rescueDetailId: number; staffId: number }>(rescueApi.assignStaff, params, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      this.currentStaffRescueState = { ...this.currentStaffRescueState, currentStatus: RESCUE_STATUS.ACCEPTED } as any;
      await this.firebaseStore.set(`${result?.rescueDetailId}`, { status: RESCUE_STATUS.ACCEPTED, invoiceId: -1 });
    }
  }

  /**
   * change current rescue detail's status to arriving
   */
  public async changeRescueStatusToArriving(params: { status: RESCUE_STATUS; estimatedArrivalTime: number }) {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(rescueApi.arrivingRescue, params, true);

    if (error) {
      this.handleError(error);
    } else {
      this.currentStaffRescueState = { currentStatus: params.status, estimatedArrivalTime: params.estimatedArrivalTime };
      this.handleSuccess();
      await this.firebaseStore.update(`${this.currentStaffProcessingRescue?.id}`, { status: RESCUE_STATUS.ARRIVING });
    }
  }

  /**
   * change current rescue detail's status to arrived rescue
   */
  public async changeRescueStatusToArrived() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(rescueApi.arrivedRescue, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      this.currentStaffRescueState = { currentStatus: RESCUE_STATUS.ARRIVED, estimatedArrivalTime: 0 };
      this.handleSuccess();
      await this.firebaseStore.update(`${this.currentStaffProcessingRescue?.id}`, { status: RESCUE_STATUS.ARRIVED });
    }
  }

  /**
   * change current rescue detail's status to working
   */
  public async changeRescueStatusToWorking() {
    this.startLoading();
    const { error } = await this.apiService.patch<any>(rescueApi.workingRescue, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      this.currentStaffRescueState = { ...this.currentStaffRescueState, currentStatus: RESCUE_STATUS.WORKING } as any;
      await this.firebaseStore.update(`${this.currentStaffProcessingRescue?.id}`, { status: RESCUE_STATUS.WORKING }).catch(console.error);
    }
  }

  /**
   * get pending rescue requests
   */
  public async getPendingRescueRequests() {
    this.startLoading();

    const { result, error } = await this.apiService.getPlural<AvailableCustomerRescueDetail>(rescueApi.pendingDetails);

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
  public async getCustomerRejectedRescueCases() {
    this.startLoading();

    const { error, result } = await this.apiService.getPlural<RejectCase>(rescueApi.customerRejectedCases, {}, true);

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

    const { error } = await this.apiService.patch<any>(rescueApi.customerRejectCurrentCase, params, true);
    await this.firebaseStore.rescueDoc?.update({ status: RESCUE_STATUS.REJECTED, customerRejected: true });

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * get all reject rescue cases garage side
   */
  public async getGarageRejectedRescueCases() {
    this.startLoading();

    const { error, result } = await this.apiService.getPlural<RejectCase>(rescueApi.garageRejectedCases, {}, true);

    if (error) {
      this.handleError(error);
    } else {
      const cases = result || [];
      runInAction(() => {
        this.garageRejectedCases = [...cases] || [];
      });
      this.handleSuccess();
    }
  }

  /**
   * garage reject current rescue case
   */
  public async garageRejectCurrentRescueCase(params: { rejectRescueCaseId: number; rejectReason: string }) {
    this.startLoading();

    const { error, result } = await this.apiService.patch<any>(rescueApi.garageRejectCurrentCase, params, true);
    await this.firebaseStore.update(`${result}`, { status: RESCUE_STATUS.REJECTED, garageRejected: true });

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
