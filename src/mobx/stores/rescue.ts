import 'reflect-metadata';
import { STATES } from '@utils/constants';
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

  state: STATES = STATES.IDLE;
  rescues: Array<RescueModel> = [];

  public async getMany(keyword: string) {
    this.state = STATES.LOADING;
    const { result, error } = await this.garageService.getMany(keyword);

    if (error) {
      runInAction(() => {
        this.state = STATES.ERROR;
      });
    } else {
      const rescues = result || [];
      runInAction(() => {
        this.state = STATES.SUCCESS;
        this.rescues = [...rescues];
      });
    }
  }
}
