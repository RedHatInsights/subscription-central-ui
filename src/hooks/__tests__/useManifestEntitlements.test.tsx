import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useManifestEntitlements from '../useManifestEntitlements';
import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();
});

const queryClient = new QueryClient();

interface wrapperProps {
  children: ReactNode;
}

const wrapper = ({ children }: wrapperProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useManifestEntitlements hook', () => {
  it('passes versions back when fetching from API', async () => {
    const mockResponse = {
      uuid: 'uuid-12345',
      name: 'foo',
      type: 'Satellite',
      version: '6.9',
      createdDate: '2020-00-19T17:17:10.000Z',
      createdBy: 'john.doe',
      lastModified: '2020-00-19T17:17:10.000Z',
      entitlementsAttachedQuantity: 10,
      entitlementsAttached: {
        valid: true,
        value: [
          {
            id: '123abc',
            sku: 'SKU123',
            contractNumber: '1123432',
            entitlementQuantity: 100
          }
        ]
      },
      simpleContentAccess: 'enabled'
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const { result, waitFor } = renderHook(() => useManifestEntitlements('uuid-12345'), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockResponse);
  });
});
