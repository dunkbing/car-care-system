import { GarageModel } from '@models/garage';
import { garageService } from '@mobx/services/garage';
import { STATES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { createContext } from 'react';

class GarageStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      garages: observable,
      searchGarage: action,
    });
  }

  state: STATES = STATES.IDLE;
  garages: Array<GarageModel> = [];

  public async searchGarage(keyword: string) {
    this.state = STATES.LOADING;
    const garages = await garageService.searchGarages(keyword);

    runInAction(() => {
      this.state = STATES.SUCCESS;
      this.garages = [...garages];
    });
  }
}

export default createContext(new GarageStore());
