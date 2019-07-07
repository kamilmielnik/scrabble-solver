import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'react-virtualized/styles.css';

import configureStore from 'store';
import App from 'app';
import './styles.scss';

const store = configureStore();
const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  );
} else {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  );
}
