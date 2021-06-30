import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ManifestEntitlementsList from '../ManifestEntitlementsList';

describe('Manifest Entitlements List', () => {
  it('renders correctly', () => {
    const props = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      entitlementsData: {
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
      },
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('fires methods in kebab menu when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const props = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      entitlementsData: {
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
      },
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>
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
    const props = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      entitlementsData: {
        valid: false,
        reason: 'No Entitlements are attached to the Allocation'
      },
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
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
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders loading when loading', () => {
    const props = {
      isLoading: true,
      isSuccess: false,
      isError: false,
      entitlementsData: {
        valid: false,
        reason: 'No Allocations found'
      },
      entitlementsRowRef: null as React.MutableRefObject<HTMLSpanElement>
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
  });
});
