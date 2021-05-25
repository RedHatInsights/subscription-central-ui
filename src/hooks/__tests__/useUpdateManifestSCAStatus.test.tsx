import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUpdateManifestSCAStatus from '../useUpdateManifestSCAStatus';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { renderHook } from '@testing-library/react-hooks';

enableFetchMocks();

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();

  queryClient.setQueryData('manifests', [
    { simpleContentAccess: 'enabled', uuid: '00000000-0000-0000-0000-000000000000' },
    { simpleContentAccess: 'enabled', uuid: '00000000-0000-0000-0000-000000000001' }
  ]);
});

describe('useUpdateManifestSCAStatus hook', () => {
  it('updates the SCA status to enabled when it receives a 204 status', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 204 });

    const { result, waitFor } = renderHook(() => useUpdateManifestSCAStatus(), { wrapper });
    result.current.mutate({
      uuid: '00000000-0000-0000-0000-000000000000',
      newSCAStatus: 'disabled'
    });

    await waitFor(() => result.current.isSuccess);

    const updatedManifests: {
      simpleContentAccess: string;
      uuid: string;
    }[] = queryClient.getQueryData('manifests');

    expect(updatedManifests[0].simpleContentAccess).toEqual('disabled');
  });

  it('does not update the SCA status to enabled when it receives a 403 status', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    fetch.mockResponseOnce(JSON.stringify({}), { status: 403 });

    const { result, waitFor } = renderHook(() => useUpdateManifestSCAStatus(), { wrapper });
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
