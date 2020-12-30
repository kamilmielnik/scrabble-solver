import { createStore, applyMiddleware } from 'redux';
import reduxSaga from 'redux-saga';

import { rootReducer } from './reducers';
import { rootSaga } from './sagas';
import { RootState } from './types';

const sagaMiddleware = reduxSaga();
const initialState: Partial<RootState> | undefined = undefined;

const createAppStore = (): ReturnType<typeof createStore> => {
  const store = createStore(rootReducer, initialState, createEnhancer());
  sagaMiddleware.run(rootSaga);
  return store;
};

const createEnhancer = () => applyMiddleware(sagaMiddleware);

export default createAppStore;
