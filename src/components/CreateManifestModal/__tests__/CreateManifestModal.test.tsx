import React from 'react';
import CreateManifestModal from '../CreateManifestModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';

jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Create Manifest Modal', () => {
  it('renders correctly once satellite versions have been loaded', async () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      isError: false,
      isLoading: false
    });
    const props = { handleModalToggle: (): null => null, isModalOpen: true };
    const { getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestModal {...props} />
      </QueryClientProvider>
    );

    expect(getByLabelText('Create satellite manifest')).toBeInTheDocument();
  });
});
