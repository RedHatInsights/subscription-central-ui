import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSatelliteVersions from '../useSatelliteVersions';
import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

const queryClient = new QueryClient();

interface wrapperProps {
  children: ReactNode;
}

const wrapper = ({ children }: wrapperProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useSatelliteVersions hook', () => {
  it('passes versions back when fetching from API', async () => {
    const mockResponse = { body: [{ value: 'sat-6.9', description: 'Satellite 6.9' }] };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const { result, waitFor } = renderHook(() => useSatelliteVersions(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockResponse);
  });
});
