import React from 'react';
import CreateManifestFormContainer from '../CreateManifestFormContainer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';

jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Create Manifest Form Container', () => {
  it('renders correctly once satellite versions have been loaded', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });
    const props = { handleModalToggle: () => 'foo' };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestFormContainer {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
