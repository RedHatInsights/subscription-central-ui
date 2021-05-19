import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import useDeleteSatelliteManifest from '../useDeleteSatelliteManifest';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useDeleteSatelliteManifest hook', () => {
  const { result, waitFor } = renderHook(() => useDeleteSatelliteManifest(), { wrapper });

  beforeEach(() => {
    //jest.clearAllMocks();
    fetch.mockResponseOnce(JSON.stringify({}), { status: 204 });
    queryClient.setQueryData('manifests', [{ uuid: '00000000-0000-0000-0000-000000000000' }]);
    result.current.mutate('00000000-0000-0000-0000-000000000000');
  });

  it('it deletes the data locally', async () => {
    await waitFor(() => result.current.isSuccess);
    const manifests: Array<any> = queryClient.getQueryData('manifests');
    expect(manifests.length).toEqual(0);
  });
});
