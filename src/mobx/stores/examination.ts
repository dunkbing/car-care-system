import { action, makeObservable, observable, runInAction } from 'mobx';
import { Service } from 'typedi';
import BaseStore from './base-store';
import { Avatar } from '@models/common';

@Service()
export default class ExaminationStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      images: observable,
      checkCondition: observable,
      selectImages: action,
      removeImage: action,
      editCheckCondition: action,
    });
  }

  images: Avatar[] = [];
  checkCondition = '';

  public selectImages = (images: Avatar[]) => {
    runInAction(() => {
      this.images = [...this.images, ...images];
      console.log(this.images);
    });
  };

  public removeImage(index: number) {
    runInAction(() => {
      this.images = this.images.filter((image, i) => i !== index);
    });
  }

  public editCheckCondition = (condition: string) => {
    runInAction(() => {
      this.checkCondition = condition;
    });
  };

  public clear() {
    runInAction(() => {
      this.images = [];
      this.checkCondition = '';
    });
  }
}
