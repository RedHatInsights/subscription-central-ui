import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateManifestForm from '../CreateManifestForm';
import { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { HttpError } from '../../../utilities/errors';

const queryClient = new QueryClient();

const handleModalToggle = jest.fn();
const submitForm = jest.fn();

const createManifestFormProps = {
  satelliteVersions: [{ description: 'Satellite v6.2', value: 'sat-6.2' }] as SatelliteVersion[],
  handleModalToggle,
  submitForm: (): null => null,
  isLoading: false,
  error: null as HttpError,
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

  it('renders a spinner when loading', () => {
    const props = { ...createManifestFormProps, isLoading: true };
    const container = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    expect(container).toHaveLoader();
  });
  describe('when a manifest is successfully being created', () => {
    it('renders a success notification', async () => {
      const props = { ...createManifestFormProps };
      render(
        <QueryClientProvider client={queryClient}>
          <CreateManifestForm {...props} />
        </QueryClientProvider>
      );
      waitFor(() => expect(screen.findByText('Manifest created')).toBeInTheDocument());
    });
  });

  describe('when the form has been successfully validated', () => {
    it('displays helper text in name field ', () => {
      const props = { ...createManifestFormProps };
      render(
        <QueryClientProvider client={queryClient}>
          <CreateManifestForm {...props} />
        </QueryClientProvider>
      );
      const nameAlert = screen.getAllByText(
        'Your manifest name must be less than 100 characters and must contain only numbers, letters, underscores, hyphens, and periods.'
      );
      expect(nameAlert).toHaveLength(1);
    });
  });
  it('fires the submitForm when button is clicked', () => {
    const props = { ...createManifestFormProps };

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );

    fireEvent.click(getByText('Create'));
    waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1));
  });

  describe('create button', () => {
    it('should be enabled with valid input and disabled with invalid input', () => {
      const props = { ...createManifestFormProps };

      const { getByRole, getByText } = render(
        <QueryClientProvider client={queryClient}>
          <CreateManifestForm {...props} />
        </QueryClientProvider>
      );
      const input = getByRole('textbox');
      const createButton = getByText('Create').parentElement;

      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('disabled');

      fireEvent.change(input, { target: { value: '123' } });

      waitFor(() => {
        expect(createButton).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('name field on form', () => {
    it('should handle change event', () => {
      const props = { ...createManifestFormProps };
      const handleNameChange = jest.fn();

      render(
        <QueryClientProvider client={queryClient}>
          <CreateManifestForm {...props} />
        </QueryClientProvider>
      );

      const input = document.querySelector('textbox');
      if (input) {
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(handleNameChange).toBe('abc');
      }
    });
  });
  it('should change value once input changes', () => {
    const props = { ...createManifestFormProps };
    render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'TEST' }
    });
    expect(screen.getByLabelText('Name')).toHaveValue('TEST');
  });

  it('validates the name field', async () => {
    const props = { ...createManifestFormProps };
    render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    const input = screen.findByRole('textbox');
    fireEvent.change(await input, 'TEST');

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(
      screen.queryByText(
        'Name requirements have not been met. Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
      )
    ).not.toBeInTheDocument();
  });
});

describe('type field on form', () => {
  it('should handle type selection event change', () => {
    const props = { ...createManifestFormProps };
    const handleTypeChange = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    const input = document.querySelector('dropdown');
    if (input) {
      fireEvent.change(input, { target: { value: 'SatelliteVersion' } });
      expect(handleTypeChange).toBe('SatelliteVersion');
    }
  });
});

it('should change value once type selection changes', () => {
  const props = { ...createManifestFormProps };
  render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );
  fireEvent.change(screen.getByLabelText('FormSelect Input'), {
    target: { value: '' }
  });
  expect(screen.getByLabelText('FormSelect Input')).toHaveValue('');
});
it('validates the type form field', () => {
  const props = { ...createManifestFormProps };
  render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );

  const input = screen.getByLabelText('FormSelect Input');
  fireEvent.change(input, 'Select Type');

  expect(screen.getByLabelText('FormSelect Input')).toHaveValue('');
  expect(screen.queryByText('Selection Required')).not.toBeInTheDocument();
});

describe('when the form fields are not valid', () => {
  it('it displays error messages to the user', async () => {
    const props = { ...createManifestFormProps };

    render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    const nameAlert = screen.findAllByText(
      'Name requirements have not been met. Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
    );
    waitFor(() => expect(nameAlert).toHaveLength(1));
    const typeAlert = screen.findAllByText('Selection Required');
    waitFor(() => expect(typeAlert).toHaveLength(1));
  });
});

it('renders the create button on form with button is disabled', () => {
  const props = { ...createManifestFormProps };

  const { queryByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestForm {...props} />
    </QueryClientProvider>
  );

  expect(queryByText('Create').parentElement).toBeDisabled();
});
describe('when the api call fails, and manifest has not been created', () => {
  it('renders an error message', () => {
    const props = { ...createManifestFormProps, isError: true };
    render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestForm {...props} />
      </QueryClientProvider>
    );
    waitFor(() =>
      expect(screen.findByText('Something went wrong. Please try again')).toBeInTheDocument()
    );
  });
  it('closes the create manifest modal on success', () => {
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
});
