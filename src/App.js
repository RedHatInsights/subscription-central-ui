import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
// eslint-disable-next-line max-len
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
// eslint-disable-next-line max-len
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    retry: 5,
    retryDelay: 10 * 1000,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  }
});

const App = (props) => {
  useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer });
    insights.chrome.init();

    insights.chrome.identifyApp('subscription-central');
    return insights.chrome.on('APP_NAVIGATION', (event) =>
      this.props.history.push(`/${event.navId}`)
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsPortal />
      <Routes childProps={props} />
    </QueryClientProvider>
  );
};

export default withRouter(connect()(App));
