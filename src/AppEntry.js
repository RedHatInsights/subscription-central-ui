import React from 'react';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';

const AppEntry = ({ logger }) => (
  <Provider store={(logger ? init(logger) : init()).getStore()}>
    <App />
  </Provider>
);

export default AppEntry;
