import 'reflect-metadata';
import { STORE_STATES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import RescueService from '@mobx/services/rescue';
import { RescueModel } from '@models/rescue';

@Service()
export default class RescueStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      rescues: observable,
      getMany: action,
    });
    void this.getMany('');
  }

  private readonly garageService = Container.get(RescueService);

  state: STORE_STATES = STORE_STATES.IDLE;
  rescues: Array<RescueModel> = [];

  public async getMany(keyword: string) {
    this.state = STORE_STATES.LOADING;
    const { result, error } = await this.garageService.find(keyword);

    if (error) {
      runInAction(() => {
        this.state = STORE_STATES.ERROR;
      });
    } else {
      const rescues = result || [];
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.rescues = [...rescues];
      });
    }
  }
}
