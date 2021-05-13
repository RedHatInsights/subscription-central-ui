import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUpdateManifestSCAStatus from '../useUpdateManifestSCAStatus';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ManifestEntry } from '../useSatelliteManifests';

enableFetchMocks();

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();
});

const queryClient = new QueryClient();

describe('useUpdateManifestSCAStatus hook', () => {
  it('returns success when given correct inputs', async () => {
    const mockResponse = { status: 204 };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const Page = () => {
      const { mutate, isSuccess } = useUpdateManifestSCAStatus();
      return (
        <div>
          <h1 data-testid="title">{isSuccess && 'Success'}</h1>
          <button onClick={() => mutate({ uuid: 'abc123', newSCAStatus: 'enabled' })}>
            mutate
          </button>
        </div>
      );
    };

    queryClient.setQueryData('manifests', (): ManifestEntry[] => {
      return [] as ManifestEntry[];
    });

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );

    expect(getByTestId('title').textContent).toBe('');
    fireEvent.click(getByText('mutate'));
    await waitFor(() => getByTestId('title'));
    expect(getByTestId('title').textContent).toBe('Success');
  });

  it('correctly updates the SCA status from enabled to disabled after the successful API call', async () => {
    const mockResponse = { status: 204 };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const Page = () => {
      const { mutate, isSuccess } = useUpdateManifestSCAStatus();
      return (
        <div>
          <h1 data-testid="title">{isSuccess && 'Success'}</h1>
          <button onClick={() => mutate({ uuid: 'abc123', newSCAStatus: 'disabled' })}>
            mutate
          </button>
        </div>
      );
    };

    const manifest1: ManifestEntry = {
      entitlementQuantity: 1,
      name: 'foo',
      type: 'Satellite',
      url: 'foo.com',
      uuid: 'abc123',
      version: '6.8',
      simpleContentAccess: 'enabled'
    };

    const manifest2: ManifestEntry = {
      entitlementQuantity: 10,
      name: 'foo',
      type: 'Satellite',
      url: 'foo.com',
      uuid: '123456',
      version: '6.8',
      simpleContentAccess: 'enabled'
    };

    queryClient.setQueryData('manifests', (): ManifestEntry[] => {
      return [manifest1, manifest2] as ManifestEntry[];
    });

    expect(queryClient.getQueryData('manifests')).toEqual([manifest1, manifest2]);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );

    fireEvent.click(getByText('mutate'));
    await waitFor(() => getByTestId('title'));
    expect(getByTestId('title').textContent).toBe('Success');
    const updatedManifestData = [
      {
        ...manifest1,
        simpleContentAccess: 'disabled'
      },
      manifest2
    ];
    expect(queryClient.getQueryData('manifests')).toEqual(updatedManifestData);
  });
});
