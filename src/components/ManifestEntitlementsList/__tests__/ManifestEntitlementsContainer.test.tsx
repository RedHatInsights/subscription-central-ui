import React from 'react';
import ManifestEntitlementsListContainer from '../ManifestEntitlementsListContainer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, waitFor } from '@testing-library/react';
import useManifestEntitlements from '../../../hooks/useManifestEntitlements';

jest.mock('../../../hooks/useManifestEntitlements');

const queryClient = new QueryClient();

describe('Manifest Entitlements Container', () => {
  it('renders correctly once entitlements have been loaded', async () => {
    (useManifestEntitlements as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      isError: false,
      data: {
        body: {
          contentAccessMode: 'Entitlement Access',
          createdBy: 'john.doe@redhat.com',
          createdDate: '2021-01-26T18:01:13.000Z',
          entitlementsAttached: {
            valid: true,
            value: [
              {
                contractNumber: '12345',
                entitlementQuantity: 10,
                id: 'id123',
                sku: 'sku123',
                startDate: '2021-01-01T00:00:00.000Z',
                endDate: '2022-01-01T00:00:00.000Z'
              }
            ]
          }
        }
      }
    });
    const props = { uuid: 'abc123' };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ManifestEntitlementsListContainer {...props} />
      </QueryClientProvider>
    );

    await waitFor(() => expect(useManifestEntitlements).toHaveBeenCalledTimes(1));

    expect(container).toMatchSnapshot();
  });
});
