import React from 'react';
import { render } from '@testing-library/react';
import SatelliteManifestPanel from '../SatelliteManifestPanel';
import useSatelliteManifests from '../../../hooks/useSatelliteManifests';

jest.mock('../../../hooks/useSatelliteManifests');

it('renders correctly', () => {
  (useSatelliteManifests as jest.Mock).mockReturnValue({
    isLoading: false,
    data: [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3'
      }
    ]
  });
  const { container } = render(<SatelliteManifestPanel />);
  expect(container).toMatchSnapshot();
});

it('renders NoResults when there are no results', () => {
  (useSatelliteManifests as jest.Mock).mockReturnValue({ isLoading: false, data: [] });

  const { container } = render(<SatelliteManifestPanel />);
  expect(container).toMatchSnapshot();
});
