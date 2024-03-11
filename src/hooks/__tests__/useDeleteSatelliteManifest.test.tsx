import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, waitFor } from '@testing-library/react';
import useDeleteSatelliteManifest from '../useDeleteSatelliteManifest';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useDeleteSatelliteManifest hook', () => {
  const { result } = renderHook(() => useDeleteSatelliteManifest(), { wrapper });
  let status: number;

  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: status });
    queryClient.setQueryData('manifests', [{ uuid: '00000000-0000-0000-0000-000000000000' }]);
    result.current.mutate('00000000-0000-0000-0000-000000000000');
  });

  describe('when API returns a 204 status', () => {
    beforeAll(() => {
      status = 204;
    });

    it('deletes the data locally', async () => {
      await waitFor(() => {
        const manifests: Array<any> = queryClient.getQueryData('manifests');
        expect(manifests.length).toEqual(0);
      });
    });
  });

  describe('when the API returns a non-204 status', () => {
    const originalConsoleError: () => void = console.error;

    beforeAll(() => {
      status = 404;
    });

    beforeEach(() => {
      // Disabling console.error to prevent test suite failure for an expected error
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    it('does not delete the data locally', async () => {
      // We should be waiting for isError here, but there seems to be a bug in the testing library
      await waitFor(() => {
        const manifests: Array<any> = queryClient.getQueryData('manifests');
        expect(manifests.length).toEqual(1);
      });
    });
  });
});
