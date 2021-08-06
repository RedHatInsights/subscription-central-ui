import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './components/Notifications';
import { useHistory } from 'react-router-dom';
import { getPartialRouteFromPath } from './utilities/routeHelpers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 10 * 1000,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

const App = () => {
  const history = useHistory();
  useEffect(() => {
    insights.chrome.init();

    insights.chrome.identifyApp('manifests');
    const unregister = insights.chrome.on('APP_NAVIGATION', (event) => {
      const partialURL = getPartialRouteFromPath(event.domEvent.href);
      history.push(partialURL);
    });
    return () => {
      unregister();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Notifications />
        <Routes />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default withRouter(connect()(App));
