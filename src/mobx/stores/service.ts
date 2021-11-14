import { ApiService } from '@mobx/services/api-service';
import { serviceApi } from '@mobx/services/api-types';
import { ServiceModel } from '@models/service';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Container, Service } from 'typedi';
import BaseStore from './base-store';

@Service()
export default class ServiceStore extends BaseStore {
  private readonly apiService = Container.get(ApiService);
  constructor() {
    super();
    makeObservable(this, {
      services: observable,
      chosenServices: observable,
      getMany: action,
      addService: action,
      removeService: action,
      updateQuantity: action,
      clearServices: action,
    });
  }

  services: Array<ServiceModel> = [];
  chosenServices: Map<number, ServiceModel> = new Map();

  public async getMany(keyword?: string): Promise<void> {
    this.startLoading();
    const { error, result } = await this.apiService.getPluralWithPagination<ServiceModel>(serviceApi.getMany, { keyword });

    if (error) {
      this.handleError(error);
    } else {
      const services = result || [];
      for (const service of services) {
        if (this.chosenServices.get(service.id)) {
          service.checked = true;
        }
      }
      runInAction(() => {
        this.services = [...services];
      });
      this.handleSuccess();
    }
  }

  public addService(service: ServiceModel): void {
    if (!service.quantity) service.quantity = 1;
    runInAction(() => {
      this.chosenServices.set(service.id, service);
    });
  }

  public removeService(service: ServiceModel): void {
    runInAction(() => {
      this.chosenServices.delete(service.id);
    });
  }

  public updateQuantity(id: number, quantity: number): void {
    runInAction(() => {
      const service = this.chosenServices.get(id);
      if (service) service.quantity = quantity;
    });
  }

  public clearServices(): void {
    runInAction(() => {
      this.chosenServices.clear();
    });
  }
}
