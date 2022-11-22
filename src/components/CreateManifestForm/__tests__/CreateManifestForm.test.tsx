import React from 'react';
import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import CreateManifestForm from '../CreateManifestForm';
import { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from 'react-query';
import '@testing-library/jest-dom';

const queryClient = new QueryClient();

const handleModalToggle = jest.fn();
const submitForm = jest.fn();

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
  it('renders with a spinner when loading', () => {
    const props = { ...createManifestFormProps, isLoading: true };
    const container = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toHaveLoader();
  });

  it('displays error messages in form fields correctly', async () => {
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

  it('renders a success notification when manifest is successfully created', async () => {
    const props = { ...createManifestFormProps, isSuccess: true };
    render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    await new Promise((r) => setTimeout(r, 2000));

    waitFor(() => expect(screen.findByText('Manifest created')).toBeInTheDocument());
  });

  it('renders a error message ', () => {
    const props = { ...createManifestFormProps };
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    fireEvent.click(getByText('Create'));

    waitFor(() =>
      expect(screen.findByText('Something went wrong. Please try again')).toBeInTheDocument()
    );
  });

  it('fires the submitForm when button is clicked ', async () => {
    const props = { ...createManifestFormProps };
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    fireEvent.click(getByText('Create'));
    waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1));
  });
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

it('renders the create button on form with button is disabled', () => {
  const props = { ...createManifestFormProps, isSuccess: false };

  const { queryByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );
  expect(queryByText('Create')).toBeDisabled();
});
