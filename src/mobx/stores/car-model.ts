import { ApiService } from '@mobx/services/api-service';
import { CarModelModel } from '@models/car-model';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';

const apiUrls = {
  models: (brandId: number) => `models/${brandId}`,
};

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
    const { error, result } = await this.apiService.getPlural<CarModelModel>(apiUrls.models(brandId), {}, true);

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
}
