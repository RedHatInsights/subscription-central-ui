import React, { useEffect } from 'react';
import { ManifestRoutes } from './Routes';
import './App.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './components/Notifications';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

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
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Notifications />
        <ManifestRoutes />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
