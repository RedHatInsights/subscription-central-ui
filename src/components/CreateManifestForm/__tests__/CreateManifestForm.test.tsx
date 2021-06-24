import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CreateManifestForm from '../CreateManifestForm';
import { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const createManifestFormProps = {
  satelliteVersions: [{ description: 'Satellite v6.2', value: 'sat-6.2' }] as SatelliteVersion[],
  handleModalToggle: (): any => null,
  isModalOpen: true,
  submitForm: (): any => null,
  isLoading: false,
  isError: false,
  isSuccess: false
};

describe('Create Manifest Form', () => {
  it('renders correctly when data is loaded', () => {
    const props = { ...createManifestFormProps };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders loading when data is being posted', () => {
    const props = { ...createManifestFormProps, isLoading: true };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('displays errors correctly', async () => {
    const props = { ...createManifestFormProps };

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    fireEvent.click(getByText('Save'));
    const nameAlert = await screen.findAllByText('Please provide a name for your new manifest');
    expect(nameAlert).toHaveLength(1);
    const typeAlert = await screen.findAllByText('Please select a version for your new manifest');
    expect(typeAlert).toHaveLength(1);
  });

  it('closes the create manifest modal on success', async () => {
    const props = { ...createManifestFormProps, isSuccess: true };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
