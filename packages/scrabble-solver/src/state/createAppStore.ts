import { applyMiddleware, compose, createStore } from 'redux';
import reduxSaga from 'redux-saga';

import rootReducer from './rootReducer';
import { rootSaga } from './sagas';
import { RootState } from './types';

const sagaMiddleware = reduxSaga();
const initialState: Partial<RootState> | undefined = undefined;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = globalThis.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createAppStore = (): ReturnType<typeof createStore> => {
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(sagaMiddleware)));
  sagaMiddleware.run(rootSaga);
  return store;
};

export default createAppStore;
