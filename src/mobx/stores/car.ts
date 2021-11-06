import { action, makeObservable, observable, runInAction } from 'mobx';
import { CarDetailModel, CarModel, CreateCarRequestModel } from '@models/car';
import CarService from '@mobx/services/car';
import { STORE_STATES } from '@utils/constants';
import { withProgress } from '@mobx/services/config';
import Container, { Service } from 'typedi';
import CarModelStore from './car-model';
import BaseStore from './base-store';

@Service()
export default class CarStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      cars: observable,
      find: action,
    });
  }

  private readonly carService = Container.get(CarService);
  private readonly carModelStore = Container.get(CarModelStore);

  cars: CarModel[] = [];
  carDetail: CarDetailModel | null = null;

  public async find() {
    this.startLoading();
    const { result, error } = await this.carService.find();

    if (error) {
      this.handleError(error);
    } else {
      const cars = result || [];
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.cars = [...cars];
      });
    }
  }

  public async findOne(id: number) {
    await this.carService.findOne(id).then(({ result }) => {
      void this.carModelStore.getModels(result?.brand.id as number);
      runInAction(() => {
        this.carDetail = result;
      });
    });
  }

  public async createCar(car: CreateCarRequestModel) {
    this.state = STORE_STATES.LOADING;
    const success = await withProgress(
      this.carService.create(car, (errors) => {
        this.handleError(errors);
        if (errors.length) {
          runInAction(() => {
            this.state = STORE_STATES.ERROR;
            this.errorMessage = errors[0].message;
          });
        }
      }),
    );

    if (success) {
      runInAction(() => {
        this.errorMessage = '';
        this.state = success ? STORE_STATES.SUCCESS : STORE_STATES.ERROR;
      });
    }
  }

  public async deleteCar(carId: number) {
    this.state = STORE_STATES.LOADING;
    const success = await withProgress(this.carService.delete(carId));

    runInAction(() => {
      this.state = success ? STORE_STATES.SUCCESS : STORE_STATES.ERROR;
    });
  }
}
