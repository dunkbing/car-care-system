import { action, makeObservable, observable, runInAction } from 'mobx';
import { CarModel, CarRequestModel } from '@models/car';
import CarService from '@mobx/services/car';
import { STATES } from '@utils/constants';
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
  state: STATES = STATES.IDLE;

  public async getCars() {
    this.state = STATES.LOADING;
    const { result, error } = await this.carService.getCars();

    if (error) {
      this.state = STATES.ERROR;
    } else {
      const cars = result || [];
      runInAction(() => {
        this.state = STATES.SUCCESS;
        this.cars = [...cars];
      });
    }
  }

  public async createCar(car: CarRequestModel) {
    this.state = STATES.LOADING;
    const { error } = await withProgress(this.carService.createCar(car));

    runInAction(() => {
      this.state = error ? STATES.ERROR : STATES.SUCCESS;
    });
  }
}
