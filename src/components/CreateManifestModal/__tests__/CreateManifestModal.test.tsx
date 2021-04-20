import React from 'react';
import CreateManifestModal from '../CreateManifestModal';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';

jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Create Manifest Form Container', () => {
  it('renders correctly once satellite versions have been loaded', async () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      isError: false,
      isLoading: false
    });
    const props = { handleModalToggle: (): any => null, isModalOpen: true };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestModal {...props} />
      </QueryClientProvider>
    );

    /**
     * document.body needed because the modal
     * does not render within the container
     *
     */
    expect(document.body).toMatchSnapshot();
  });
});
