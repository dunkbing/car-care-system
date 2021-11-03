// mocking api call
jest.mock('../services/auth');

import { STORE_STATES } from '@utils/constants';
import AuthStore from './auth';

describe('Auth Store', () => {
  let store: AuthStore;

  beforeEach(() => {
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
