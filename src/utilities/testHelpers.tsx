import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WrapperComponent } from '@testing-library/react-hooks';

interface wrapperProps {
  children: ReactNode;
}

export const createReactQueryWrapper = (): WrapperComponent<unknown> => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: wrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return wrapper;
};
