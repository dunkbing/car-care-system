import { ApiService } from '@mobx/services/api-service';
import { CarBrandModel } from '@models/car-brand';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Container, Service } from 'typedi';

const apiUrls = {
  brands: 'brands',
};

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
    const { error, result } = await this.apiService.getPlural<CarBrandModel>(apiUrls.brands, {}, true);

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
