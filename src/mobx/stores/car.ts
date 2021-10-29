import { action, makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';
import { CarModel, CarRequestModel } from '@models/car';
import { carService } from '@mobx/services/car';
import { STATES } from '@utils/constants';
import { withProgress } from '@mobx/services/config';

class CarStore {
  constructor() {
    makeObservable(this, {
      cars: observable,
      getCars: action,
    });
  }

  cars: CarModel[] = [];
  state: STATES = STATES.IDLE;

  public async getCars() {
    this.state = STATES.LOADING;
    const { result, error } = await carService.getCars();

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
    const { error } = await withProgress(carService.createCar(car));

    runInAction(() => {
      this.state = error ? STATES.ERROR : STATES.SUCCESS;
    });
  }
}

export default createContext(new CarStore());
