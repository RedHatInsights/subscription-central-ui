import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ManifestRoutes } from './Routes';
import './App.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './components/Notifications';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  useEffect(() => {
    insights.chrome.init();

    insights.chrome.identifyApp('manifests');
    const unregister = insights.chrome.on('APP_NAVIGATION', (event) => {
      const partialURL = getPartialRouteFromPath(event.domEvent.href);
      navigate(partialURL);
    });
    return () => {
      unregister();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Notifications />
        <ManifestRoutes />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default connect()(App);
