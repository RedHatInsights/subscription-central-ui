import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestForm from '../CreateManifestForm';
import { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

describe('Create Manifest Form', () => {
  it('renders correctly', () => {
    const satelliteVersions: SatelliteVersion[] = [
      { description: 'Satellite v6.2', value: 'sat-6.2' }
    ];

    const props = { satelliteVersions, handleModalToggle: () => 'foo', isModalOpen: true };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
