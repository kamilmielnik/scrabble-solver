import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Clipboard from 'clipboard';
import configureStore from 'store';
import App from 'modules/app';
import 'react-virtualized/styles.css';
import './styles.scss';

new Clipboard('.clipboard');
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
