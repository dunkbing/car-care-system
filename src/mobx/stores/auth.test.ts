// mocking api call
jest.mock('../services/auth');

import AuthService from '@mobx/services/auth';
import { STORE_STATES } from '@utils/constants';
import Container from 'typedi';
import AuthStore from './auth';
import GarageStore from './garage';

describe('Auth Store', () => {
  let store: AuthStore;

  beforeEach(() => {
    Container.set(AuthService, new AuthService());
    Container.set(GarageStore, new GarageStore());
    store = new AuthStore();
  });

  it('should login', async () => {
    expect(store.state).toBe(STORE_STATES.IDLE);
    expect(store.user).toBeNull();

    await store.login({ emailOrPhone: 'bingbd@gmail.com', password: 'abc@123' });

    expect(store.state).toBe(STORE_STATES.SUCCESS);
    expect(store.user).not.toBeNull();
  });

  it('incorrect login info', async () => {
    expect(store.state).toBe(STORE_STATES.IDLE);
    expect(store.user).toBeNull();

    await store.login({ emailOrPhone: '012345678', password: 'incorrect' });

    expect(store.state).toBe(STORE_STATES.ERROR);
    expect(store.user).toBeNull();
  });

  it('incorrect email/phone format', async () => {
    expect(store.state).toBe(STORE_STATES.IDLE);
    expect(store.user).toBeNull();

    await store.login({ emailOrPhone: 'incorrect format', password: 'incorrect' });

    expect(store.state).toBe(STORE_STATES.ERROR);
    expect(store.user).toBeNull();
  });
});
