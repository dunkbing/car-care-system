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
    });
  }

  services: Array<ServiceModel> = [];
  chosenServices: Array<ServiceModel> = [];

  public async getMany(keyword?: string): Promise<void> {
    this.startLoading();
    const { error, result } = await this.apiService.getPluralWithPagination<ServiceModel>(serviceApi.getMany, { keyword });

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      const services = result || [];
      runInAction(() => {
        this.services = [...services];
      });
    }
  }

  public addPart(part: ServiceModel): void {
    runInAction(() => {
      this.chosenServices = [...this.chosenServices, part];
    });
  }

  public removePart(part: ServiceModel): void {
    runInAction(() => {
      this.chosenServices = this.chosenServices.filter((p) => p.id !== part.id);
    });
  }

  public clearParts(): void {
    runInAction(() => {
      this.chosenServices = [];
    });
  }
}
