import { action, makeObservable } from 'mobx';
import Container, { Service } from 'typedi';
import firestore from '@react-native-firebase/firestore';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { feedbackApi, firestoreCollection } from '@mobx/services/api-types';
import { CreateFeedbackRequestParams, UpdateFeedbackRequestParams } from '@models/feedback';
import { log } from '@utils/logger';
import { RESCUE_STATUS } from '@utils/constants';

@Service()
export default class FeedbackStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      create: action,
    });
  }

  private readonly apiService = Container.get(ApiService);

  public async create(feedbackType: 'feedbackToCustomer' | 'feedbackToGarage', feedback: CreateFeedbackRequestParams) {
    this.startLoading();

    try {
      const { error, result } = await this.apiService.post(feedbackApi[feedbackType], feedback, true, true);
      log.info('createFeedback', result, error, feedback);

      if (error) {
        throw error;
      }
      await firestore().collection(firestoreCollection.rescues).doc(`${feedback.rescueDetailId}`).update({ status: RESCUE_STATUS.DONE });
      this.handleSuccess();
    } catch (e) {
      this.handleError(e);
    }
  }

  public async update(feedbackType: 'updateFeedbackToCustomer' | 'updateFeedbackToGarage', feedback: UpdateFeedbackRequestParams) {
    this.startLoading();

    try {
      const { error, result } = await this.apiService.patch(feedbackApi[feedbackType], feedback, true, true);
      log.info('updateFeedback', result, error, feedback);

      if (error) {
        throw error;
      }
      this.handleSuccess();
    } catch (e) {
      this.handleError(e);
    }
  }
}
