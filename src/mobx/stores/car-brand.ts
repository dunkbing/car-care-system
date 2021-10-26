import { brandService } from '@mobx/services/car-brand';
import { CarBrandModel } from '@models/car-brand';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';

class BrandStore {
  constructor() {
    makeObservable(this, {
      brands: observable,
      getBrands: action,
    });
  }

  brands: Array<CarBrandModel> = [];

  public async getBrands() {
    const { error, result } = await brandService.getBrands();

    if (error) {
      runInAction(() => {
        this.brands = [];
      });
    } else {
      const brands = result || [];
      runInAction(() => {
        this.brands = [...brands];
      });
    }
  }
}

export default createContext(new BrandStore());
