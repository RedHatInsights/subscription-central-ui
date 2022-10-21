import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Component, { ManifestEntitlementsListProps } from '../ManifestEntitlementsList';
import { QueryClient, QueryClientProvider } from 'react-query';
import useManifestEntitlements, {
  EntitlementsAttachedData
} from '../../../hooks/useManifestEntitlements';

const queryClient = new QueryClient();
jest.mock('../../../hooks/useManifestEntitlements');

const ManifestEntitlementsList = (props: ManifestEntitlementsListProps) => (
  <QueryClientProvider client={queryClient}>
    <Component {...props} />
  </QueryClientProvider>
);

const mockResponse = (entitlementsAttached: EntitlementsAttachedData, isLoading = false) => {
  (useManifestEntitlements as jest.Mock).mockReturnValue({
    isLoading,
    isSuccess: true,
    isError: false,
    data: {
      body: {
        entitlementsAttached
      }
    }
  });
};

describe('Manifest Entitlements List', () => {
  it('renders correctly', () => {
    const entitlementsData = {
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
    };
    mockResponse(entitlementsData);
    const props = {
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>,
      uuid: 'abc123'
    };
    const { getByLabelText } = render(<ManifestEntitlementsList {...props} />);

    expect(
      getByLabelText('Allocations table').children[1].firstChild.childNodes[1].textContent
    ).toEqual(entitlementsData.value[0].sku);
  });

  it.skip('fires methods in kebab menu when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const entitlementsData = {
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
    };
    mockResponse(entitlementsData);
    const props = {
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>,
      uuid: 'abc123'
    };
    const { getByText } = render(<ManifestEntitlementsList {...props} />);

    fireEvent.click(document.querySelector('.pf-c-dropdown__toggle'));
    fireEvent.click(getByText('Remove Subscription'));

    fireEvent.click(document.querySelector('.pf-c-dropdown__toggle'));
    fireEvent.click(getByText('Move Subscription'));

    expect(console.log).toHaveBeenCalledTimes(2);

    consoleSpy.mockRestore();
  });

  it('renders correctly when no entitlements are attached to the manifest', () => {
    mockResponse({
      valid: false,
      reason: 'No Entitlements are attached to the Allocation'
    });
    const props = {
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>,
      uuid: 'abc123'
    };
    const { queryByLabelText } = render(<ManifestEntitlementsList {...props} />);

    expect(queryByLabelText('Allocations table')).toBeNull();
  });

  it('renders with an error message when the API call fails', () => {
    const props = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      entitlementsData: {
        valid: false,
        reason: 'No Entitlements are attached to the Allocation'
      },
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>,
      uuid: 'abc123'
    };
    render(<ManifestEntitlementsList {...props} />);
    expect(document.querySelector('.sub-no-entitlements-reason').firstChild.textContent).toEqual(
      props.entitlementsData.reason
    );
  });

  it('renders loading when loading', () => {
    mockResponse(
      {
        valid: false,
        reason: 'No Allocations found'
      },
      true
    );
    const props = {
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>,
      uuid: 'abc123'
    };
    const container = render(<ManifestEntitlementsList {...props} />);
    expect(container).toHaveLoader();
  });
});
