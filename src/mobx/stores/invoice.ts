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
  ManagerUpdateProposalRequest,
  PendingProposal,
  UpdateProposalRequest,
} from '@models/invoice';
import firestore from '@react-native-firebase/firestore';
import RescueStore from './rescue';
import { ACCOUNT_TYPES, INVOICE_STATUS } from '@utils/constants';
import AuthStore from './auth';
import { log } from '@utils/logger';

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
      staffCreateProposal: action,
      managerUpdateProposal: action,
      customerAcceptProposal: action,
      customerConfirmsPayment: action,
      staffConfirmsPayment: action,
      getGarageInvoiceDetail: action,
      getCustomerInvoiceDetail: action,
      getProposalDetail: action,
    });
  }

  private readonly apiService = Container.get(ApiService);
  private readonly rescueStore = Container.get(RescueStore);
  private readonly authStore = Container.get(AuthStore);

  invoiceProposal: InvoiceProposal | null = null;
  customerInvoiceDetail: InvoiceHistoryDetail | null = null;
  garageInvoiceDetail: InvoiceHistoryDetail | null = null;
  staffProposalDetail: InvoiceDetail | null = null;
  managerProposalDetail: InvoiceDetail | null = null;
  pendingProposals: PendingProposal[] = [];

  //#region manager process proposal

  /**
   * manager update a proposal, change invoice status to SENT_QUOTATION_TO_CUSTOMER
   * @param proposal
   */
  public async managerUpdateProposal(proposal: ManagerUpdateProposalRequest) {
    log.info('managerUpdateProposal', JSON.stringify(proposal));
    this.startLoading();

    try {
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
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * get manager proposal detail
   * @param invoiceId
   */
  public async getManagerProposalDetail(invoiceId: number) {
    log.info('getManagerProposalDetail', invoiceId);
    this.startLoading();

    try {
      const { result, error } = await this.apiService.get<InvoiceDetail>(invoiceApi.getGarageInvoiceDetail(invoiceId), {}, true);

      if (error) {
        this.handleError(error);
      } else {
        runInAction(() => {
          this.managerProposalDetail = result;
          this.managerProposalDetail?.automotivePartInvoices.forEach((partInvoice) => {
            partInvoice.automotivePart.listedPrice = partInvoice.automotivePart.price;
            partInvoice.note = partInvoice.note ?? '';
          });
          this.managerProposalDetail?.serviceInvoices?.forEach((serviceInvoice) => {
            serviceInvoice.service.listedPrice = serviceInvoice.service.price;
            serviceInvoice.note = serviceInvoice.note ?? '';
          });
        });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * update an automotive part by id
   * @param id
   * @param note
   * @param isWarranty
   */
  public editAutomotivePart(id: number, note: string, isWarranty: boolean) {
    runInAction(() => {
      const part = this.managerProposalDetail?.automotivePartInvoices.find((part) => part.automotivePart.id === id);
      if (part) {
        part.note = note;
        part.isWarranty = isWarranty;
        part.automotivePart.price = isWarranty ? 0 : part.automotivePart.listedPrice;
      }
    });
  }

  /**
   * edit a service by id
   * @param id
   * @param noteOrPrice
   */
  public editService(id: number, noteOrPrice: string | number) {
    runInAction(() => {
      if (this.managerProposalDetail) {
        const service = this.managerProposalDetail.serviceInvoices.find((service) => service.service.id === id);
        if (service) {
          if (typeof noteOrPrice === 'string') {
            service.note = noteOrPrice;
          } else {
            service.service.price = noteOrPrice;
          }
        }
      }
    });
  }
  //#endregion

  /**
   * staff create a proposal (draft invoice)
   * @param proposal
   */
  public async staffCreateProposal(proposal: CreateProposalRequest) {
    log.info('staffCreateProposal', proposal);
    this.startLoading();

    try {
      const { result, error } = await this.apiService.post<InvoiceProposal>(invoiceApi.createProposal, proposal, true);

      if (error) {
        this.handleError(error);
      } else {
        this.invoiceProposal = result;
        const invoiceId = result!.id;
        if (this.authStore.userType === ACCOUNT_TYPES.CUSTOMER) {
          await this.getCustomerInvoiceDetail(invoiceId);
        } else {
          await this.getGarageInvoiceDetail(invoiceId);
          await this.staffSendProposalToManager(invoiceId);
        }
        await firestore()
          .collection(firestoreCollection.rescues)
          .doc(`${this.rescueStore.currentStaffProcessingRescue?.id}`)
          .update({ invoiceId: result?.id });
        await firestore().collection(firestoreCollection.invoices).doc(`${result?.id}`).set({ status: result?.status });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * staff update a proposal, change invoice status to SENT_PROPOSAL_TO_CUSTOMER
   * @param proposal
   */
  public async staffUpdateProposal(proposal: UpdateProposalRequest) {
    log.info('updateProposal', proposal);
    this.startLoading();

    try {
      const { error } = await this.apiService.put<InvoiceProposal>(invoiceApi.update, proposal, true);

      if (error) {
        this.handleError(error);
      } else {
        await firestore()
          .collection(firestoreCollection.invoices)
          .doc(`${proposal.invoiceId}`)
          .update({ status: INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
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

  /**
   * get proposal detail by id
   * @param invoiceId
   */
  public async getProposalDetail(invoiceId: number) {
    log.info('getProposalDetail', invoiceId);
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

  /**
   * send proposal to customer, change invoice status to SENT_PROPOSAL_TO_CUSTOMER
   * @param invoiceId
   */
  public async sendProposalToCustomer(invoiceId: number) {
    log.info('sendProposalToCustomer', invoiceId);
    this.startLoading();

    try {
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
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * customer accept proposal (draft invoice)
   * @param invoiceId
   */
  public async customerAcceptProposal(invoiceId: number) {
    log.info('customerAcceptProposal', invoiceId);
    this.startLoading();

    try {
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
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * send proposal to manager
   * @param invoiceId
   */
  public async staffSendProposalToManager(invoiceId: number) {
    log.info('staffSendProposalToManager', invoiceId);
    this.startLoading();

    try {
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
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * customer confirms payment
   * @param invoiceId
   */
  public async customerConfirmsPayment(invoiceId: number) {
    log.info('customerConfirmsPayment', invoiceId);
    this.startLoading();

    try {
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
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * staff confirms payment and switch the rescue detail status to Done
   * @param invoiceId
   */
  public async staffConfirmsPayment(invoiceId: number) {
    log.info('staffConfirmsPayment', invoiceId);
    this.startLoading();

    try {
      const { error } = await this.apiService.patch(invoiceApi.staffConfirmPayment(invoiceId), {}, true);

      if (error) {
        this.handleError(error);
      } else {
        await firestore()
          .collection(firestoreCollection.invoices)
          .doc(`${invoiceId}`)
          .update({ status: INVOICE_STATUS.STAFF_CONFIRM_PAID });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * customer reject proposal
   * @param invoiceId
   * @param rejectReason
   */
  public async customerRejectProposal(invoiceId: number, rejectReason: string) {
    log.info('customerRejectProposal', invoiceId);
    this.startLoading();

    try {
      const { error } = await this.apiService.patch(invoiceApi.customerRejectProposal, { invoiceId, rejectReason }, true);

      if (error) {
        this.handleError(error);
      } else {
        await firestore().collection(firestoreCollection.invoices).doc(`${invoiceId}`).update({ status: INVOICE_STATUS.DRAFT });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * customer reject quotation
   * @param invoiceId
   * @param rejectReason
   */
  public async customerRejectQuotation(invoiceId: number, rejectReason: string) {
    log.info('customerRejectQuotation', invoiceId, rejectReason);
    this.startLoading();

    try {
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
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * get invoice detail for customer side
   */
  public async getCustomerInvoiceDetail(invoiceId: number) {
    log.info('getCustomerInvoiceDetail', invoiceId);
    this.startLoading();

    try {
      const { result, error } = await this.apiService.get<InvoiceHistoryDetail>(invoiceApi.getCustomerInvoiceDetail(invoiceId), {}, true);

      if (error) {
        this.handleError(error);
      } else {
        this.handleSuccess();
        runInAction(() => {
          this.customerInvoiceDetail = Object.assign({}, result);
        });
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * get invoice detail for garage side
   */
  public async getGarageInvoiceDetail(invoiceId: number) {
    log.info('getGarageInvoiceDetail', invoiceId);
    this.startLoading();

    try {
      const { result, error } = await this.apiService.get<InvoiceHistoryDetail>(invoiceApi.getGarageInvoiceDetail(invoiceId), {}, true);

      if (error) {
        this.handleError(error);
      } else {
        runInAction(() => {
          this.garageInvoiceDetail = result;
        });
        this.handleSuccess();
      }
    } catch (e) {
      this.handleError(e);
    }
  }
}
