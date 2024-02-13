import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUpdateManifestSCAStatus from '../useUpdateManifestSCAStatus';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { renderHook, waitFor } from '@testing-library/react';

enableFetchMocks();

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  fetch.resetMocks();

  queryClient.setQueryData('manifests', [
    { simpleContentAccess: 'enabled', uuid: '00000000-0000-0000-0000-000000000000' },
    { simpleContentAccess: 'enabled', uuid: '00000000-0000-0000-0000-000000000001' }
  ]);

  queryClient.setQueryData(['manifestEntitlements', '00000000-0000-0000-0000-000000000000'], {
    body: { simpleContentAccess: 'enabled' }
  });
});

describe('useUpdateManifestSCAStatus hook', () => {
  it('updates the SCA status to enabled when it receives a 204 status', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 204 });

    const { result } = renderHook(() => useUpdateManifestSCAStatus(), { wrapper });
    result.current.mutate({
      uuid: '00000000-0000-0000-0000-000000000000',
      newSCAStatus: 'disabled'
    });

    await waitFor(() => {
      const updatedManifests: {
        simpleContentAccess: string;
        uuid: string;
      }[] = queryClient.getQueryData('manifests');

      const updatedEntitlements: {
        body: { simpleContentAccess: string };
      } = queryClient.getQueryData([
        'manifestEntitlements',
        '00000000-0000-0000-0000-000000000000'
      ]);

      expect(updatedManifests[0].simpleContentAccess).toEqual('disabled');
      expect(updatedEntitlements.body.simpleContentAccess).toEqual('disabled');
    });
  });

  it('does not update the SCA status to enabled when it receives a 403 status', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    fetch.mockResponseOnce(JSON.stringify({}), { status: 403 });

    const { result } = renderHook(() => useUpdateManifestSCAStatus(), { wrapper });
    result.current.mutate({
      uuid: '00000000-0000-0000-0000-000000000000',
      newSCAStatus: 'disabled'
    });

    await waitFor(() => result.current.isSuccess);

    const updatedManifests: {
      simpleContentAccess: string;
      uuid: string;
    }[] = queryClient.getQueryData('manifests');

    expect(updatedManifests[0].simpleContentAccess).toEqual('enabled');

    console.error = originalError;
  });
});
