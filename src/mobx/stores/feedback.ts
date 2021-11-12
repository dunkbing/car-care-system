import { action, makeObservable } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { feedbackApi } from '@mobx/services/api-types';
import { FeedbackRequestParams } from '@models/feedback';

@Service()
export default class FeedbackStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      createFeedback: action,
    });
  }

  private readonly apiService = Container.get(ApiService);

  public async createFeedback(feedbackType: keyof typeof feedbackApi, feedback: FeedbackRequestParams) {
    this.startLoading();
    const { error } = await this.apiService.post(feedbackType, feedback, true);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
