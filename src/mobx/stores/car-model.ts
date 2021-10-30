import CarModelService from '@mobx/services/car-model';
import { CarModelModel } from '@models/car-model';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';

@Service()
export default class CarModelStore {
  private readonly modelService = Container.get(CarModelService);
  constructor() {
    makeObservable(this, {
      models: observable,
      getModels: action,
    });
  }

  models: Array<CarModelModel> = [];

  public async getModels(brandId: number) {
    const { error, result } = await this.modelService.getModels(brandId);

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
