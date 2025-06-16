import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { QueryClientProvider, QueryClient } from 'react-query';
import factories from '../../../utilities/factories';
import useUser from '../../../hooks/useUser';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSatelliteVersions');
const queryClient = new QueryClient();

it('renders the modal properly when the button is clicked', async () => {
  (useSatelliteVersions as jest.Mock).mockReturnValue({
    body: [] as SatelliteVersion[],
    refetch: jest.fn(),
    isError: false,
    isLoading: false
  });

  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestButtonWithModal user={factories.user.build({ canWriteManifests: true })} />
    </QueryClientProvider>
  );

  fireEvent.click(getByText('Create new manifest'));
  expect(
    getByText(
      'Creating a manifest allows you to export subscriptions to your on-premise subscription management application. Match the type and version of the subscription management application that you are using. All fields are required.'
    )
  ).toBeInTheDocument();
});

it('renders the Create manifest form with disabled button for user', async () => {
  (useSatelliteVersions as jest.Mock).mockReturnValue({
    body: [] as SatelliteVersion[],
    refetch: jest.fn(),
    isLoading: false,
    data: []
  });
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestButtonWithModal user={factories.user.build({ canWriteManifests: false })} />
    </QueryClientProvider>
  );

  expect(getByText('Create new manifest').closest('button')).toHaveAttribute('disabled');
});

it('renders the create button disabled', () => {
  (useUser as jest.Mock).mockReturnValue(factories.user.build({ isEntitled: false }));
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <CreateManifestButtonWithModal user={factories.user.build({ canWriteManifests: false })} />
    </QueryClientProvider>
  );

  expect(getByText('Create new manifest').closest('button')).toHaveAttribute('disabled');
});
