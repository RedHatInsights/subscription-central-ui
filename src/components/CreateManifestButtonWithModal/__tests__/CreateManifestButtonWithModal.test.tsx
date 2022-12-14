import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import factories from '../../../utilities/factories';
import { createQueryWrapper } from '../../../utilities/testHelpers';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSatelliteVersions');

it('renders the modal properly when the button is clicked', async () => {
  (useSatelliteVersions as jest.Mock).mockReturnValue({
    body: [] as SatelliteVersion[],
    isError: false,
    isLoading: false
  });

  const { getByText } = render(
    <CreateManifestButtonWithModal user={factories.user.build({ canWriteManifests: true })} />,
    {
      wrapper: createQueryWrapper()
    }
  );

  fireEvent.click(getByText('Create new manifest'));
  expect(
    getByText(
      'Creating a manifest allows you to export subscriptions to your on-premise subscription management application. Match the type and version of the subscription management application that you are using. All fields are required.'
    )
  ).toBeInTheDocument();
});

it('renders the Create manifest form with disabled button for user', async () => {
  window.insights = {};

  (useSatelliteVersions as jest.Mock).mockReturnValue({
    body: [] as SatelliteVersion[],
    isLoading: false,
    data: []
  });
  const { getByText } = render(
    <CreateManifestButtonWithModal user={factories.user.build({ canWriteManifests: false })} />,
    {
      wrapper: createQueryWrapper()
    }
  );

  expect(getByText('Create new manifest').closest('button')).toHaveAttribute('disabled');
});
