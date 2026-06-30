import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHasRelation } from '../../../hooks/useHasRelation';

jest.mock('../../../hooks/useSatelliteVersions');
jest.mock('../../../hooks/useHasRelation');

const queryClient = new QueryClient();

const mockKesselCheck = (canWriteManifests: boolean) => {
  (useHasRelation as jest.Mock).mockReturnValue({
    isLoading: false,
    has: canWriteManifests
  });
};

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestButtonWithModal />
    </QueryClientProvider>
  );

beforeEach(() => {
  jest.clearAllMocks();

  (useSatelliteVersions as jest.Mock).mockReturnValue({
    body: [] as SatelliteVersion[],
    refetch: jest.fn(),
    isError: false,
    isLoading: false
  });
});

it('renders the modal properly when the button is clicked', async () => {
  mockKesselCheck(true);

  const { getByText } = renderComponent();

  fireEvent.click(getByText('Create new manifest'));

  expect(
    getByText(
      'Creating a manifest allows you to export subscriptions to your on-premise subscription management application. Match the type and version of the subscription management application that you are using. All fields are required.'
    )
  ).toBeInTheDocument();
});

it('renders the Create manifest form with disabled button for user', async () => {
  mockKesselCheck(false);

  const { getByText } = renderComponent();

  expect(getByText('Create new manifest').closest('button')).toHaveAttribute('disabled');
});

it('renders the create button disabled', () => {
  mockKesselCheck(false);

  const { getByText } = renderComponent();

  expect(getByText('Create new manifest').closest('button')).toHaveAttribute('disabled');
});
