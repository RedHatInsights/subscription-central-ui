import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import { createQueryWrapper } from '../../../utilities/testHelpers';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';

jest.mock('../../../hooks/useSatelliteVersions');

describe('Create Manifest Button With Modal', () => {
  it('renders the modal properly when the button is clicked', async () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      isError: false,
      isLoading: false
    });

    const { getByText } = render(<CreateManifestButtonWithModal />, {
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
