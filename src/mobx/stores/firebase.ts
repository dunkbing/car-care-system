import { firestoreCollection } from '@mobx/services/api-types';
import { GarageUser } from '@models/user';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { ACCOUNT_TYPES } from '@utils/constants';
import { makeObservable, observable } from 'mobx';
import Container, { Service } from 'typedi';
import AuthStore from './auth';
import BaseStore from './base-store';

@Service()
export default class FirebaseStore extends BaseStore {
  private readonly authStore = Container.get(AuthStore);

  constructor() {
    super();
    makeObservable(this, {
      garageDeviceTokens: observable,
    });
    this.rescuesRef = firestore().collection(firestoreCollection.rescues);
  }

  rescuesRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  rescueDoc: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> | null = null;
  garageDeviceTokens: Array<string> = [];

  public async get<T = any>() {
    try {
      const doc = await this.rescueDoc?.get();
      return doc?.data() as T;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public async set(key: string, value: any) {
    this.rescueDoc = this.rescuesRef.doc(`${key}`);
    await this.rescuesRef.doc(key).set(value).catch(console.error);
  }

  public async update(key: string, value: any) {
    await this.rescuesRef.doc(key).update(value).catch(console.error);
  }

  public async addDeviceToken() {
    this.startLoading();
    try {
      const token = await messaging().getToken();
      if (this.authStore.userType === ACCOUNT_TYPES.GARAGE_MANAGER) {
        const user = this.authStore.user as GarageUser;
        const doc = await firestore().collection(firestoreCollection.managerDeviceTokens).doc(`${user?.garage?.id}`).get();
        const tokens = doc.data()?.tokens || [];
        if (!tokens.includes(token)) {
          tokens.push(token);
          await firestore().collection(firestoreCollection.managerDeviceTokens).doc(`${this.authStore.user?.id}`).set({ tokens });
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}
