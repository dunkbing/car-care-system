import { ApiService } from '@mobx/services/api-service';
import { carBrandApi } from '@mobx/services/api-types';
import { CarBrandModel } from '@models/car-brand';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Container, Service } from 'typedi';

@Service()
export default class BrandStore {
  private readonly apiService = Container.get(ApiService);
  constructor() {
    makeObservable(this, {
      brands: observable,
      getBrands: action,
    });
    void this.getBrands();
  }

  brands: Array<CarBrandModel> = [];

  public async getBrands() {
    const { error, result } = await this.apiService.getPlural<CarBrandModel>(carBrandApi.brands, {}, true);

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
