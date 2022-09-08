import React, { FC } from 'react';
import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import CreateManifestButtonWithModal from '..';
import { createQueryWrapper } from '../../../utilities/testHelpers';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import { User } from '../../../hooks/useUser';
import { CreateManifestPanel } from '../../emptyState';
import { ExitStatus } from 'typescript';
import SatelliteManifestPanel from '../../SatelliteManifestPanel';
import { mergeProps } from '@patternfly/react-table/dist/esm/components/Table/base';
import { QueryClientProvider, useQueryClient } from 'react-query';

describe('Create Manifest Button With Modal', () => {
  it('renders the modal properly when the button is clicked', async () => {
    jest.mock('../../../hooks/useSatelliteVersions', () => ({
      body: [] as SatelliteVersion[],
      isLoading: false,
      isError: false
    }));
    const { getByText } = render(<CreateManifestButtonWithModal {...get('props')} />);

    fireEvent.click(getByText('Create new manifest'));
    await screen.findAllByText(
      'Creating a new manifest allows you to export subscriptions to your on-premise subscription management application.'
    );
    // waitFor(() => expect(screen.findByText('Create Manifest')).toBeInTheDocument());
    /**
     * document.body needed because the modal
     * does not render within the container
     *
     */
    expect(document.body).toMatchSnapshot();
  });
});
