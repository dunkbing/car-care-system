import { GarageModel } from '@models/garage';
import { garageService } from '@mobx/services/garage';
import { STATES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';

class GarageStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      defaultGarage: observable,
      garages: observable,
      searchGarage: action,
    });
  }

  state: STATES = STATES.IDLE;
  defaultGarage: GarageModel | null = null;
  garages: Array<GarageModel> = [];

  public setDefaultGarage(garage: GarageModel) {
    runInAction(() => {
      this.defaultGarage = garage;
    });
  }

  public async searchGarage(keyword: string) {
    this.state = STATES.LOADING;
    const { result, error } = await garageService.searchGarages(keyword);

    if (error) {
      runInAction(() => {
        this.state = STATES.ERROR;
      });
    } else {
      const garages = result || [];
      runInAction(() => {
        this.state = STATES.SUCCESS;
        this.garages = [...garages];
      });
    }
  }
}

export default createContext(new GarageStore());
