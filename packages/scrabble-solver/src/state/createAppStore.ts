import { createStore, applyMiddleware, compose } from 'redux';
import reduxSaga from 'redux-saga';

import { rootReducer } from './reducers';
import { rootSaga } from './sagas';
import { RootState } from './types';

const sagaMiddleware = reduxSaga();
const initialState: Partial<RootState> | undefined = undefined;

const createAppStore = (): ReturnType<typeof createStore> => {
  const store = createStore(rootReducer, initialState, createEnhancer());
  sagaMiddleware.run(rootSaga);
  // enableHmrForReducers(store);
  return store;
};

const createEnhancer = () => compose(applyMiddleware(sagaMiddleware));

// const enableHmrForReducers = (store) => {
//   if (module.hot) {
//     const replaceReducer = () => store.replaceReducer(require('./reducers').default);
//     module.hot.accept('./reducers', replaceReducer);
//   }
// };

export default createAppStore;
