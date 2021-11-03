import { action, makeObservable, observable, runInAction } from 'mobx';
import { CarModel, CreateCarRequestModel } from '@models/car';
import CarService from '@mobx/services/car';
import { STORE_STATES } from '@utils/constants';
import { withProgress } from '@mobx/services/config';
import Container, { Service } from 'typedi';

@Service()
export default class CarStore {
  constructor() {
    makeObservable(this, {
      cars: observable,
      getCars: action,
    });
  }

  private readonly carService = Container.get(CarService);

  cars: CarModel[] = [];
  state: STORE_STATES = STORE_STATES.IDLE;

  public async getCars() {
    this.state = STORE_STATES.LOADING;
    const { result, error } = await this.carService.findCustomerHistories();

    if (error) {
      runInAction(() => {
        this.state = STORE_STATES.ERROR;
      });
    } else {
      const cars = result || [];
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.cars = [...cars];
      });
    }
  }

  public async createCar(car: CreateCarRequestModel) {
    this.state = STORE_STATES.LOADING;
    const success = await withProgress(this.carService.create(car));

    runInAction(() => {
      this.state = success ? STORE_STATES.ERROR : STORE_STATES.SUCCESS;
    });
  }
}
