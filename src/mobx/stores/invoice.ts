import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { firestoreCollection, invoiceApi } from '@mobx/services/api-types';
import {
  CreateProposalRequest,
  InvoiceDetail,
  InvoiceHistoryDetail,
  InvoiceProposal,
  PendingProposal,
  UpdateProposalRequest,
} from '@models/invoice';
import firestore from '@react-native-firebase/firestore';
import RescueStore from './rescue';
import FirebaseStore from './firebase';
import { ACCOUNT_TYPES, INVOICE_STATUS } from '@utils/constants';
import AuthStore from './auth';

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
      staffProposalDetail: observable,
      managerProposalDetail: observable,
      createProposal: action,
      managerUpdateProposal: action,
      acceptProposal: action,
      customerConfirmsPayment: action,
      staffConfirmsPayment: action,
      getGarageInvoiceDetail: action,
      getCustomerInvoiceDetail: action,
      getProposalDetail: action,
    });
  }

  private readonly apiService = Container.get(ApiService);
  private readonly rescueStore = Container.get(RescueStore);
  private readonly firebaseStore = Container.get(FirebaseStore);
  private readonly authStore = Container.get(AuthStore);

  invoiceProposal: InvoiceProposal | null = null;
  customerInvoiceDetail: InvoiceHistoryDetail | null = null;
  garageInvoiceDetail: InvoiceHistoryDetail | null = null;
  staffProposalDetail: InvoiceDetail | null = null;
  managerProposalDetail: InvoiceDetail | null = null;
  pendingProposals: PendingProposal[] = [];

  //#region manager process proposal
  public async getManagerProposalDetail(invoiceId: number) {
    this.startLoading();
    const { result, error } = await this.apiService.get<InvoiceDetail>(invoiceApi.getGarageInvoiceDetail(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.managerProposalDetail = result;
      });
      this.handleSuccess();
    }
  }

  public editAutomotivePart(id: number, note: string, isWarranty: boolean) {
    runInAction(() => {
      const part = this.managerProposalDetail?.automotivePartInvoices.find((part) => part.automotivePart.id === id);
      if (part) {
        part.note = note;
        part.isWarranty = isWarranty;
      }
    });
  }

  public editService(id: number, note: string, price: number) {
    runInAction(() => {
      if (this.managerProposalDetail) {
        const service = this.managerProposalDetail.serviceInvoices.find((service) => service.service.id === id);
        if (service) {
          service.note = note;
          service.service.price = price;
        }
      }
    });
  }
  //#endregion

  // Create a proposal (draft invoice)
  public async createProposal(proposal: CreateProposalRequest) {
    this.startLoading();
    const { result, error } = await this.apiService.post<InvoiceProposal>(
      invoiceApi.createProposal,
      {
        rescueDetailId: proposal.rescueDetailId,
        serviceProposals: proposal.serviceInvoices.map((service) => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
        })),
        automotivePartProposals: proposal.automotivePartInvoices.map((part) => ({
          automotivePartId: part.automotivePartId,
          quantity: part.quantity,
        })),
      },
      true,
    );

    if (error) {
      this.handleError(error);
    } else {
      this.invoiceProposal = result;
      if (this.authStore.userType === ACCOUNT_TYPES.CUSTOMER) {
        await this.getCustomerInvoiceDetail(result!.id);
      } else {
        await this.getGarageInvoiceDetail(result!.id);
      }
      await firestore()
        .collection(firestoreCollection.rescues)
        .doc(`${this.rescueStore.currentStaffProcessingRescue?.id}`)
        .update({ invoiceId: result?.id, invoiceStatus: result?.status })
        .catch(console.error);
      await firestore().collection(firestoreCollection.invoices).doc(`${result?.id}`).set({ status: result?.status }).catch(console.error);
      this.handleSuccess();
    }
  }

  // Update a proposal
  public async updateProposal(proposal: {
    invoiceId: number;
    rescueDetailId: number;
    serviceProposals: Array<{
      serviceId: number;
      quantity: number;
    }>;
    automotivePartProposals: Array<{
      automotivePartId: number;
      quantity: number;
    }>;
  }) {
    this.startLoading();
    console.log('update proposal', proposal);

    const { result, error } = await this.apiService.put<InvoiceProposal>(invoiceApi.update, proposal, true);

    console.log('update proposal', error, result);

    if (error) {
      this.handleError(error);
    } else {
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${proposal.invoiceId}`)
        .update({ status: INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER });
      this.handleSuccess();
    }
  }

  // Manager update a proposal (draft invoice)
  public async managerUpdateProposal(proposal: UpdateProposalRequest) {
    this.startLoading();
    const { error } = await this.apiService.put('invoices', proposal, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${proposal.id}`)
        .update({ status: INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER });
      this.handleSuccess();
    }
  }

  // Get detail proposal
  public async getProposalDetail(invoiceId: number) {
    this.startLoading();
    const { result, error } = await this.apiService.get<InvoiceDetail>(invoiceApi.getProposalDetail(invoiceId));

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.staffProposalDetail = result;
      });
      this.handleSuccess();
    }
  }

  public async sendProposalToCustomer(invoiceId: number) {
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.sendProposalToCustomer(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${invoiceId}`)
        .update({ status: INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER });
      this.handleSuccess();
    }
  }

  // Customer accept proposal (Draft invoice)
  public async acceptProposal(invoiceId: number) {
    this.startLoading();
    const { error } = await this.apiService.post(invoiceApi.accepProposal(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${invoiceId}`)
        .update({ status: INVOICE_STATUS.CUSTOMER_CONFIRMED_PROPOSAL });
      runInAction(() => {
        this.customerInvoiceDetail = { ...this.customerInvoiceDetail, status: INVOICE_STATUS.CUSTOMER_CONFIRMED_PROPOSAL } as any;
      });
      this.handleSuccess();
    }
  }

  // Send proposal to manager
  public async sendProposalToManager(invoiceId: number) {
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.sendProposalToManager(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${invoiceId}`)
        .update({ status: INVOICE_STATUS.SENT_PROPOSAL_TO_MANAGER });
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
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${invoiceId}`)
        .update({ status: INVOICE_STATUS.CUSTOMER_CONFIRM_PAID });
      this.handleSuccess();
    }
  }

  // Staff confirms payment and switch the rescue detail status to Done
  public async staffConfirmsPayment(invoiceId: number) {
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.staffConfirmPayment(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore().collection(firestoreCollection.invoices).doc(`${invoiceId}`).update({ status: INVOICE_STATUS.STAFF_CONFIRM_PAID });
      this.handleSuccess();
    }
  }

  // Customer reject proposal
  public async customerRejectProposal(invoiceId: number, rejectReason: string) {
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.customerRejectProposal, { invoiceId, rejectReason }, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore().collection(firestoreCollection.invoices).doc(`${invoiceId}`).update({ status: INVOICE_STATUS.DRAFT });
      this.handleSuccess();
    }
  }

  // Customer reject quotation
  public async customerRejectQuotation(invoiceId: number, rejectReason: string) {
    console.log('reject quotation', invoiceId, rejectReason);
    this.startLoading();
    const { error } = await this.apiService.patch(invoiceApi.customerRejectQuotation, { invoiceId, rejectReason }, true);

    if (error) {
      this.handleError(error);
    } else {
      await firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${invoiceId}`)
        .update({ status: INVOICE_STATUS.SENT_PROPOSAL_TO_MANAGER });
      this.handleSuccess();
    }
  }

  /**
   * Get invoice detail for customer side
   */
  public async getCustomerInvoiceDetail(invoiceId: number) {
    this.startLoading();
    const { result, error } = await this.apiService.get<InvoiceHistoryDetail>(invoiceApi.getCustomerInvoiceDetail(invoiceId), true);
    console.log('getCustomerInvoiceDetail', result);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      runInAction(() => {
        this.customerInvoiceDetail = Object.assign({}, result);
      });
    }
  }

  /**
   * Get invoice detail for garage side
   */
  public async getGarageInvoiceDetail(invoiceId: number) {
    this.startLoading();
    const { result, error } = await this.apiService.get<InvoiceHistoryDetail>(invoiceApi.getGarageInvoiceDetail(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
      runInAction(() => {
        this.garageInvoiceDetail = result;
      });
      this.handleSuccess();
    }
  }

  /**
   * get pending proposals
   */
  public async getPendingProposals() {
    this.startLoading();
    const { result, error } = await this.apiService.getPlural<PendingProposal>(invoiceApi.getPendingProposals);

    if (error) {
      this.handleError(error);
    } else {
      const proposals = result || [];
      runInAction(() => {
        this.pendingProposals = proposals;
      });
      this.handleSuccess();
    }
  }
}
