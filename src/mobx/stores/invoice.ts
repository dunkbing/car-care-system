import { action, makeObservable } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { invoiceApi } from '@mobx/services/api-types';
import { CreateProposalRequest, UpdateProposalRequest } from '@models/invoice';

export enum FeedbackTypes {
  CUSTOMER,
  GARAGE,
}

@Service()
export default class InvoiceStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      create: action,
      update: action,
    });
  }

  private readonly apiService = Container.get(ApiService);

  // Create a proposal (draft invoice)
  public async create(proposal: CreateProposalRequest) {
    this.startLoading();
    const { error } = await this.apiService.post(invoiceApi.create, proposal, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
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
    const { error } = await this.apiService.post(invoiceApi.accepProposal(invoiceId), {}, true);

    if (error) {
      this.handleError(error);
    } else {
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

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
