import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import factories from '../../../utilities/factories';
import { createQueryWrapper } from '../../../utilities/testHelpers';
import { def } from 'bdd-lazy-var';
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
  await screen.findAllByText(
    'Creating a new manifest allows you to export subscriptions to your on-premise subscription management application.'
  );
  /**
   * document.body needed because the modal
   * does not render within the container
   *
   */
  expect(document.body).toMatchSnapshot();
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
  expect(document.body).toMatchSnapshot();
});
