import { action, makeObservable } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { feedbackApi } from '@mobx/services/api-types';
import { FeedbackRequestParams } from '@models/feedback';
import { log } from '@utils/logger';

@Service()
export default class FeedbackStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      create: action,
    });
  }

  private readonly apiService = Container.get(ApiService);

  public async create(feedbackType: keyof typeof feedbackApi, feedback: FeedbackRequestParams) {
    this.startLoading();
    const { error, result } = await this.apiService.post(feedbackApi[feedbackType], feedback, true, true);
    log.info('create feedback', result, error, feedback);

    if (error) {
      this.handleError(error);
    } else {
      this.handleSuccess();
    }
  }
}
