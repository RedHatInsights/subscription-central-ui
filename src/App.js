import React, { useEffect } from 'react';
import { ManifestRoutes } from './Routes';
import './App.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './components/Notifications';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';

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
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    updateDocumentTitle('manifests');
  }, []);

  return (
    <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <Notifications />
          <ManifestRoutes />
        </NotificationProvider>
      </QueryClientProvider>
    </AccessCheck.Provider>
  );
};

export default App;
