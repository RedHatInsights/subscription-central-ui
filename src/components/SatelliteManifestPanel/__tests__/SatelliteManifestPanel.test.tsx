import React from 'react';
import { render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import SatelliteManifestPanel from '../SatelliteManifestPanel';
import { ManifestEntry } from '../../../hooks/useSatelliteManifests';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';

jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Satellite Manifest Panel', () => {
  it('renders correctly', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];

    const props = {
      data,
      isFetching: false,
      user: { status: 'loaded', isOrgAdmin: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders no results when there are no results', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const props = {
      data: [] as ManifestEntry[],
      isFetching: false,
      user: { status: 'loaded', isOrgAdmin: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders loading when refetching data', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [];

    const props = {
      data,
      isFetching: true,
      user: { status: 'loaded', isOrgAdmin: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
