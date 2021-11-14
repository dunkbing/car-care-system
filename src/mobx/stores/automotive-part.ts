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
  chosenParts: Map<number, AutomotivePartModel> = new Map();

  public async getMany(keyword?: string): Promise<void> {
    this.startLoading();
    const { error, result } = await this.apiService.getPluralWithPagination<AutomotivePartModel>(automotivePartApi.getMany, { keyword });

    if (error) {
      this.handleError(error);
    } else {
      const automotiveParts = result || [];
      runInAction(() => {
        for (const part of automotiveParts) {
          if (this.chosenParts.get(part.id)) {
            part.checked = true;
          }
        }
        this.automotiveParts = [...automotiveParts];
      });
      this.handleSuccess();
    }
  }

  public addPart(part: AutomotivePartModel): void {
    if (!part.quantity) part.quantity = 1;
    runInAction(() => {
      this.chosenParts.set(part.id, part);
    });
  }

  public removePart(part: AutomotivePartModel): void {
    runInAction(() => {
      this.chosenParts.delete(part.id);
    });
  }

  public updateQuantity(id: number, quantity: number): void {
    runInAction(() => {
      const part = this.chosenParts.get(id);
      if (part) part.quantity = quantity;
    });
  }

  public clearParts(): void {
    runInAction(() => {
      this.chosenParts.clear();
    });
  }
}
