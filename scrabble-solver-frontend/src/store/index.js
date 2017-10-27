import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import intl from 'intl';
import rootReducer from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const initialState = {
  intl: intl['en-US']
};

export default () => {
  const store = createStore(rootReducer, initialState, createEnhancer());
  sagaMiddleware.run(sagas);
  enableHmrForReducers(store);
  return store;
};

const createEnhancer = () => compose(applyMiddleware(
  sagaMiddleware
));

const enableHmrForReducers = (store) => {
  if (module.hot) {
    const replaceReducer = () => store.replaceReducer(require('./reducers').default);
    module.hot.accept('./reducers', replaceReducer);
  }
};
