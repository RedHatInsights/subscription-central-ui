import React from 'react';
import { render } from '@testing-library/react';
import SatelliteManifestPanel from '../SatelliteManifestPanel';
import { ManifestEntry } from '../../../hooks/useSatelliteManifests';

jest.mock('../../../hooks/useSatelliteManifests');

describe('Satellite Manifest Panel', () => {
  it('renders correctly', () => {
    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5
      }
    ];
    const props = {
      isLoading: false,
      data
    };

    const { container } = render(<SatelliteManifestPanel {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders no results when there are no results', () => {
    const props = { isLoading: false, data: [] as ManifestEntry[] };

    const { container } = render(<SatelliteManifestPanel {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders an error message when an error comes back from the API', () => {
    const props = { isLoading: false, error: true, data: [] as ManifestEntry[] };

    const { container } = render(<SatelliteManifestPanel {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders loading spinner when loading', () => {
    const props = { isLoading: true, data: undefined as ManifestEntry[] };
    const { container } = render(<SatelliteManifestPanel {...props} />);
    expect(container).toMatchSnapshot();
  });
});
