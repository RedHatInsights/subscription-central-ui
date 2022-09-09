import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import factories from '../../../utilities/factories';
import useUser from '../../../hooks/useUser';
import { CreateManifestForm } from '../../CreateManifestForm';
import { createQueryWrapper } from '../../../utilities/testHelpers';
import { QueryClient, QueryClientProvider } from 'react-query';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Create Manifest Form', () => {
  def('canReadManifests', () => true);
  def('canWriteManifests', () => true);
  def('user', () => {
    return factories.user.build({ canWriteManifests: get('canWriteManifests') });
  });

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      isLoading: get('loading'),
      isFetching: false,
      isSuccess: true,
      isError: get('error'),
      data: get('user')
    });

    if (get('error') === false) {
      queryClient.setQueryData('user', get('user'));
    }
  });

  describe('Create Manifest Button With Modal', () => {
    def('canWriteManifests', () => true);

    it('renders the modal properly when the button is clicked', async () => {
      (useSatelliteVersions as jest.Mock).mockReturnValue({
        body: [] as SatelliteVersion[],
        isError: false,
        isLoading: false
      });

      const { getByText } = render(<CreateManifestButtonWithModal {...get('props')} />, {
        wrapper: createQueryWrapper()
      });

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
  });

  describe('when the user does not have Write permissions', () => {
    def('canWriteManifests', () => false);

    it('renders the Create manifest form with disabled button for user', async () => {
      window.insights = {};

      (useSatelliteVersions as jest.Mock).mockReturnValue({
        body: [] as SatelliteVersion[],
        isLoading: false,
        data: []
      });
      const { getByText, container } = render(<CreateManifestForm {...get('props')} />);

      fireEvent.click(container, <CreateManifestForm {...get('props')} />);
      fireEvent.click(getByText('Create new manifest'));

      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });
});
