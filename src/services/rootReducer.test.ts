import store, { rootReducer } from './store';
import { burgerInitialState } from './redusers/burgerSlice';
import { orderInitialState } from './redusers/orderSlice';
import { userInitialState } from './redusers/userSlice';

describe('rootReducer', () => {
  it('должен корректно инициализироваться с начальным состоянием', () => {
    const state = store.getState();

    expect(state.burger).toEqual(burgerInitialState);
    expect(state.order).toEqual(orderInitialState);
    expect(state.user).toEqual(userInitialState);
  });
});
