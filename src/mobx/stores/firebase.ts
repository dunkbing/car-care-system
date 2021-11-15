import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { makeObservable } from 'mobx';
import { Service } from 'typedi';
import BaseStore from './base-store';

@Service()
export default class FirebaseStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {});
    this.rescuesRef = firestore().collection('rescues');
  }

  rescuesRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  rescueDoc: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> | null = null;

  public async get<T = any>() {
    try {
      console.log(this.rescueDoc);
      const doc = await this.rescueDoc?.get();
      console.log(doc);
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
}
