// mocking api call
import { STORE_STATUS } from '@utils/constants';
import Container from 'typedi';
import AuthStore from './auth';

describe('Auth Store', () => {
  let store: AuthStore;

  beforeAll(() => {
    Container.set(AuthStore, new AuthStore());
    store = Container.get(AuthStore);
  });

  it('should login', async () => {
    expect(store.state).toBe(STORE_STATUS.IDLE);
    expect(store.user).toBeNull();

    await store.login({ emailOrPhone: 'bingbd@gmail.com', password: 'abc@123' });

    expect(store.state).toBe(STORE_STATUS.SUCCESS);
    expect(store.user).not.toBeNull();
  });

  it('incorrect login info', async () => {
    expect(store.state).toBe(STORE_STATUS.IDLE);
    expect(store.user).toBeNull();

    await store.login({ emailOrPhone: '012345678', password: 'incorrect' });

    expect(store.state).toBe(STORE_STATUS.ERROR);
    expect(store.user).toBeNull();
  });

  it('incorrect email/phone format', async () => {
    expect(store.state).toBe(STORE_STATUS.IDLE);
    expect(store.user).toBeNull();

    await store.login({ emailOrPhone: 'incorrect format', password: 'incorrect' });

    expect(store.state).toBe(STORE_STATUS.ERROR);
    expect(store.user).toBeNull();
  });
});
