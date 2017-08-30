import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { en } from 'intl';
import rootReducer from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const initialState = {
  intl: en
};

export default function configureStore() {
  const store = createStore(rootReducer, initialState, createEnhancer());
  sagaMiddleware.run(sagas);
  enableHmrForReducers(store);
  return store;
}

const createEnhancer = () => compose(applyMiddleware(
  sagaMiddleware,
  require('redux-thunk').default
));

const enableHmrForReducers = (store) => {
  if(module.hot) {
    const replaceReducer = () => store.replaceReducer(require('./reducers').default);
    module.hot.accept('./reducers', replaceReducer);
  }
};
