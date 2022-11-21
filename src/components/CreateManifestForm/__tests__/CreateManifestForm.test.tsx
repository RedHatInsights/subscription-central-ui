import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CreateManifestForm from '../CreateManifestForm';
import { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from 'react-query';
import '@testing-library/jest-dom';

const queryClient = new QueryClient();

const handleModalToggle = jest.fn();

const createManifestFormProps = {
  satelliteVersions: [{ description: 'Satellite v6.2', value: 'sat-6.2' }] as SatelliteVersion[],
  handleModalToggle,
  isModalOpen: true,
  submitForm: (): any => null,
  isLoading: false,
  isError: false,
  isSuccess: false
};

describe('Create Manifest Form', () => {
  it('renders correctly when data is loaded', () => {
    const props = { ...createManifestFormProps };
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(getByText('Create manifest')).toBeInTheDocument();
  });

  it('renders loading when data is being posted', () => {
    const props = { ...createManifestFormProps, isLoading: true };
    const container = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toHaveLoader();
  });

  it('displays errors correctly', async () => {
    const props = { ...createManifestFormProps };

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    fireEvent.click(getByText('Create'));
    const nameAlert = await screen.findAllByText(
      'Name requirements have not been met. Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
    );
    expect(nameAlert).toHaveLength(1);
    const typeAlert = await screen.findAllByText('Selection Required');
    expect(typeAlert).toHaveLength(1);
  });

  it('closes the create manifest modal on success', async () => {
    const props = { ...createManifestFormProps, isSuccess: false };

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    expect(
      screen.queryByText(
        'Creating a manifest allows you to export subscriptions to your on-premise subscription management application. Match the type and version of the subscription management application that you are using. All fields are required.'
      )
    ).toBeInTheDocument();

    props.isSuccess = true;

    rerender(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    expect(
      screen.queryByText(
        'Creating a manifest allows you to export subscriptions to your on-premise subscription management application. Match the type and version of the subscription management application that you are using. All fields are required.'
      )
    ).toBeNull();
  });
  describe('when the form fields contain errors', () => {
    it('does render the delete button, button is disabled', () => {
      const props = { ...createManifestFormProps, isSuccess: false };
      const { queryByText, container } = render(
        <QueryClientProvider client={queryClient}>
          <CreateManifestForm {...props} />
        </QueryClientProvider>
      );
      fireEvent.click(container.querySelector('.pf-c-button'));
      expect(queryByText('Create').closest('button')).toBeDisabled();
    });
  });
  describe('when the form fields are validated', () => {
    it('does render the create button, and the button is not disabled', () => {
      const props = { ...createManifestFormProps, isSuccess: false };
      const { queryByText, container } = render(
        <QueryClientProvider client={queryClient}>
          <CreateManifestForm {...props} />
        </QueryClientProvider>
      );
      fireEvent.click(container.querySelector('.pf-c-button'));
      expect(queryByText('Create').closest('button'));
    });
  });
});
