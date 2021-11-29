import { ApiService } from '@mobx/services/api-service';
import { carModelApi } from '@mobx/services/api-types';
import { CarModelModel } from '@models/car-model';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';

@Service()
export default class CarModelStore {
  private readonly apiService = Container.get(ApiService);
  constructor() {
    makeObservable(this, {
      models: observable,
      getModels: action,
    });
  }

  models: Array<CarModelModel> = [];

  public async getModels(brandId: number) {
    const { error, result } = await this.apiService.getPlural<CarModelModel>(carModelApi.models(brandId), {}, true);

    if (error) {
      runInAction(() => {
        this.models = [];
      });
    } else {
      const brands = result || [];
      runInAction(() => {
        this.models = [...brands];
      });
    }
  }

  public clear() {
    runInAction(() => {
      this.models = [];
    });
  }
}
