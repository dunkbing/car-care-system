import CarBrand from '@mobx/services/car-brand';
import { withProgress } from '@mobx/services/config';
import { CarBrandModel } from '@models/car-brand';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Container, Service } from 'typedi';

@Service()
export default class BrandStore {
  private readonly brandService = Container.get(CarBrand);
  constructor() {
    makeObservable(this, {
      brands: observable,
      getBrands: action,
    });
    void this.getBrands();
  }

  brands: Array<CarBrandModel> = [];

  public async getBrands() {
    const { error, result } = await withProgress(this.brandService.findCustomerHistories());

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
