import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import logger from 'redux-logger';
import getBaseName from './utilities/getBaseName';
import { Skeleton } from '@redhat-cloud-services/frontend-components';

ReactDOM.render(
  <Provider store={init(logger).getStore()}>
    <Suspense fallback={<Skeleton />}>
      <Router basename={getBaseName(window.location.pathname)}>
        <App />
      </Router>
    </Suspense>
  </Provider>,

  document.getElementById('root')
);
