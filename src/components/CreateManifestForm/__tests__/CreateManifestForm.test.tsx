import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateManifestForm from '../CreateManifestForm';
import { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from 'react-query';
import '@testing-library/jest-dom';

const queryClient = new QueryClient();

const handleModalToggle = jest.fn();
const submitForm = jest.fn();
const handleNameChange = jest.fn();

const createManifestFormProps = {
  satelliteVersions: [{ description: 'Satellite v6.2', value: 'sat-6.2' }] as SatelliteVersion[],
  handleModalToggle,
  handleNameChange,
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
describe('when manifest is being created', () => {
  it('renders a spinner', () => {
    const props = { ...createManifestFormProps, isLoading: true };
    const container = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toHaveLoader();
  });

  it('displays helper text when name field has successfully been validated', async () => {
    const props = { ...createManifestFormProps };
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    props.isSuccess = true;

    fireEvent.click(getByText('Create'));
    const nameAlert = await screen.findAllByText(
      'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
    );
    expect(nameAlert).toHaveLength(1);
  });
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
  const props = { ...createManifestFormProps };
  render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );

  await new Promise((r) => setTimeout(r, 2000));

  waitFor(() => expect(screen.findByText(`Manifest created`)).toBeInTheDocument());
});
it('renders a error message when manifest has not been created ', () => {
  const props = { ...createManifestFormProps };
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );
  fireEvent.click(getByText('Create'));

  props.isError = true;

  waitFor(() =>
    expect(screen.findByText('Something went wrong. Please try again')).toBeInTheDocument()
  );
});

it('fires the submitForm when button is clicked, and form is valid ', async () => {
  const props = { ...createManifestFormProps };
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );
  props.isSuccess = true;
  fireEvent.click(getByText('Create'));
  waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1));
});

it('closes the create manifest modal on success', async () => {
  const props = { ...createManifestFormProps };

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

it('renders the create button on form with button is disabled until form validates', () => {
  const props = { ...createManifestFormProps };

  const { queryByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );

  props.isSuccess = true;

  expect(queryByText('Create')).toBeDisabled();
});
