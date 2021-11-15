import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { invoiceApi } from '@mobx/services/api-types';
import { CreateProposalRequest, InvoiceDetail, InvoiceProposal, UpdateProposalRequest } from '@models/invoice';
import firestore from '@react-native-firebase/firestore';
import RescueStore from './rescue';
import FirebaseStore from './firebase';
import { INVOICE_STATUS } from '@utils/constants';

export enum FeedbackTypes {
  CUSTOMER,
  GARAGE,
}

@Service()
export default class InvoiceStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      invoiceProposal: observable,
      customerInvoiceDetail: observable,
      garageInvoiceDetail: observable,
      create: action,
      update: action,
      acceptProposal: action,
      customerConfirmsPayment: action,
      staffConfirmsPayment: action,
      getGarageInvoiceDetail: action,
      getCustomerInvoiceDetail: action,
    });
  }

  private readonly apiService = Container.get(ApiService);
  private readonly rescueStore = Container.get(RescueStore);
  private readonly firebaseStore = Container.get(FirebaseStore);

  invoiceProposal: InvoiceProposal | null = null;
  customerInvoiceDetail: InvoiceDetail | null = null;
  garageInvoiceDetail: InvoiceDetail | null = null;

  // Create a proposal (draft invoice)
  public async create(proposal: CreateProposalRequest) {
    this.startLoading();
    const { result, error } = await this.apiService.post<InvoiceProposal>(invoiceApi.create, proposal);
    console.log('invoice', result);
    console.log(`${this.rescueStore.currentStaffProcessingRescue?.id}`);
    await firestore()
      .collection('rescues')
      .doc(`${this.rescueStore.currentStaffProcessingRescue?.id}`)
      .update({ invoiceId: result?.id, invoiceStatus: result?.status })
      .catch(console.error);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      this.invoiceProposal = result;
    }
  }

  // Update a proposal (draft invoice)
  public async update(proposal: UpdateProposalRequest) {
    this.startLoading();
    const { error } = await this.apiService.put(invoiceApi.update, proposal, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  // Accept proposal (Draft invoice)
  public async acceptProposal(invoiceId: number) {
    this.startLoading();
    const { error, result } = await this.apiService.post(invoiceApi.accepProposal(invoiceId), {}, true);
    console.log('accept proposal', invoiceId, result, error);

    if (error) {
      this.handleError(error);
    } else {
      await this.firebaseStore.rescueDoc?.update({ invoiceStatus: INVOICE_STATUS.PENDING });
      this.handleSuccess();
    }
  }

  // Customer confirms payment
  public async customerConfirmsPayment(invoiceId: number) {
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.customerConfirmPayment(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  // Staff confirms payment and switch the rescue detail status to Done
  public async staffConfirmsPayment(invoiceId: number) {
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.staffConfirmPayment(invoiceId), {}, true);
    console.log(error);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }

  /**
   * Get invoice detail for customer side
   */
  public async getCustomerInvoiceDetail(invoiceId: number) {
    this.startLoading();
    const { result, error } = await this.apiService.get<InvoiceDetail>(invoiceApi.getCustomerInvoiceDetail(invoiceId), true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      runInAction(() => {
        this.customerInvoiceDetail = result;
      });
    }
  }

  /**
   * Get invoice detail for garage side
   */
  public async getGarageInvoiceDetail(invoiceId: number) {
    this.startLoading();
    const { result, error } = await this.apiService.get<InvoiceDetail>(invoiceApi.getGarageInvoiceDetail(invoiceId), true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      runInAction(() => {
        this.garageInvoiceDetail = result;
      });
    }
  }
}
