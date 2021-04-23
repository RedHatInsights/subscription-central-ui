import React from 'react';
import { render } from '@testing-library/react';
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
      }
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when no entitlements are attached to the manifest', () => {
    const props = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      entitlementsData: {
        valid: false,
        reason: 'No Entitlements are attached to the Allocation'
      }
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
      }
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders loading when loading', () => {
    const props = {
      isLoading: true,
      isSuccess: false,
      isError: false,
      entitlementsData: {}
    };
    const { container } = render(<ManifestEntitlementsList {...props} />);
    expect(container).toMatchSnapshot();
  });
});
