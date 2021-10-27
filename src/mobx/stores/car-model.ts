import { modelService } from '@mobx/services/car-model';
import { CarModelModel } from '@models/car-model';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';

class CarModelStore {
  constructor() {
    makeObservable(this, {
      models: observable,
      getModels: action,
    });
  }

  models: Array<CarModelModel> = [];

  public async getModels(brandId: number) {
    const { error, result } = await modelService.getModels(brandId);

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

export default createContext(new CarModelStore());
