import { ApiService } from '@mobx/services/api-service';
import { automotivePartApi } from '@mobx/services/api-types';
import { AutomotivePartModel } from '@models/automotive-part';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Container, Service } from 'typedi';
import BaseStore from './base-store';

@Service()
export default class AutomotivePartStore extends BaseStore {
  private readonly apiService = Container.get(ApiService);
  constructor() {
    super();
    makeObservable(this, {
      automotiveParts: observable,
      chosenParts: observable,
      getMany: action,
    });
  }

  automotiveParts: Array<AutomotivePartModel> = [];
  chosenParts: Array<AutomotivePartModel> = [];

  public async getMany(keyword?: string): Promise<void> {
    this.startLoading();
    const { error, result } = await this.apiService.getPluralWithPagination<AutomotivePartModel>(automotivePartApi.getMany, { keyword });

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
      const automotiveParts = result || [];
      runInAction(() => {
        this.automotiveParts = [...automotiveParts];
      });
    }
  }

  public addPart(part: AutomotivePartModel): void {
    runInAction(() => {
      this.chosenParts = [...this.chosenParts, part];
    });
  }

  public removePart(part: AutomotivePartModel): void {
    runInAction(() => {
      this.chosenParts = this.chosenParts.filter((p) => p.id !== part.id);
    });
  }

  public clearParts(): void {
    runInAction(() => {
      this.chosenParts = [];
    });
  }
}
