import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSatelliteVersions, { fetchSatelliteVersions } from '../useSatelliteVersions';
import { renderHook, waitFor } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

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

    const { result } = renderHook(() => useSatelliteVersions(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  it('throws an error when not 200', async () => {
    fetch.mockResponse(JSON.stringify({}), { status: 400 });

    try {
      await fetchSatelliteVersions(new Promise((res) => res('')))();
    } catch (e) {
      expect(e.message).toContain('Failed to fetch satellite versions:');
    }
  });
});
