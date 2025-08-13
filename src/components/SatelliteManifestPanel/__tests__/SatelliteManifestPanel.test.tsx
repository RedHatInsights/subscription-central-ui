import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import '@testing-library/jest-dom';
import SatelliteManifestPanel from '../SatelliteManifestPanel';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import factories from '../../../utilities/factories';
import { get, def } from 'bdd-lazy-var';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Satellite Manifest Panel', () => {
  def('canReadManifests', () => true);
  def('canWriteManifests', () => true);
  def('user', () => {
    return factories.user.build({
      canWriteManifests: get('canWriteManifests')
    });
  });
  def('data', () => {
    return [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '6.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];
  });
  def('fetching', () => false);
  def('props', () => {
    return {
      data: get('data'),
      isFetching: get('fetching'),
      user: get('user')
    };
  });

  beforeEach(() => {
    queryClient.setQueryData('user', get('user'));
  });

  describe('when user does not have write permission and there are no results', () => {
    def('canWriteManifests', () => false);
    def('data', () => []);

    it('renders no results', () => {
      (useSatelliteVersions as jest.Mock).mockReturnValue({
        body: [] as SatelliteVersion[],
        refetch: jest.fn()
      });

      const { getByLabelText } = render(
        <QueryClientProvider client={queryClient}>
          <SatelliteManifestPanel {...get('props')} />
        </QueryClientProvider>
      );

      expect(getByLabelText('Satellite Manifest Table').children.length).toEqual(1);
    });
  });

  describe('when there are no results', () => {
    def('data', () => []);

    it('renders a blank state', () => {
      (useSatelliteVersions as jest.Mock).mockReturnValue({
        body: [] as SatelliteVersion[],
        refetch: jest.fn()
      });

      const { getByText } = render(
        <QueryClientProvider client={queryClient}>
          <SatelliteManifestPanel {...get('props')} />
        </QueryClientProvider>
      );
      expect(getByText('Create a new manifest to export subscriptions')).toBeInTheDocument();
    });
  });

  describe('when refetching data', () => {
    def('fetching', () => true);

    it('renders loading', () => {
      (useSatelliteVersions as jest.Mock).mockReturnValue({
        body: [] as SatelliteVersion[],
        refetch: jest.fn(),

        isLoading: true
      });

      const container = render(
        <QueryClientProvider client={queryClient}>
          <SatelliteManifestPanel {...get('props')} />
        </QueryClientProvider>
      );
      expect(container).toHaveLoader();
    });
  });

  it('opens the side panel when the row name is clicked', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      refetch: jest.fn()
    });

    const { container, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...get('props')} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId('expand-details-button-0'));
    expect(container.querySelector('.sub-c-drawer__panel-manifest-details')).toBeInTheDocument();
  });

  it('opens the delete popup from clicking the kebab menu', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      refetch: jest.fn()
    });

    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...get('props')} />
      </QueryClientProvider>
    );

    fireEvent.click(getByLabelText('Kebab toggle'));
    fireEvent.click(getByText('Delete'));

    expect(
      screen.queryByText('I acknowledge that this action cannot be undone')
    ).toBeInTheDocument();
  });

  it('Shows export message when successfully exported', async () => {
    jest.mock('../../../hooks/useExportSatelliteManifest', () => ({
      data: null,
      mutate: null,
      isLoading: false,
      isSuccess: true,
      isError: false
    }));

    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...get('props')} />
      </QueryClientProvider>
    );

    fireEvent.click(getByLabelText('Kebab toggle'));
    fireEvent.click(getByText('Export'));

    await new Promise((r) => setTimeout(r, 2000));

    waitFor(() => expect(screen.findByText('Download manifest')).toBeInTheDocument());
  });

  it('opens the side panel when the row name is clicked', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      refetch: jest.fn()
    });

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...get('props')} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId('expand-details-button-0'));
    expect(getByText('UUID')).toBeInTheDocument();
  });

  it('opens the delete popup from clicking the kebab menu', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      refetch: jest.fn()
    });

    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...get('props')} />
      </QueryClientProvider>
    );
    fireEvent.click(getByLabelText('Kebab toggle'));
    fireEvent.click(getByText('Delete'));

    expect(
      screen.queryByText('I acknowledge that this action cannot be undone')
    ).toBeInTheDocument();
  });

  describe('when the user does not have write permissions', () => {
    def('canWriteManifests', () => false);

    it('does render the delete button, button is disabled', () => {
      (useSatelliteVersions as jest.Mock).mockReturnValue({
        body: [] as SatelliteVersion[],
        refetch: jest.fn()
      });

      const { queryByText, getByLabelText } = render(
        <QueryClientProvider client={queryClient}>
          <SatelliteManifestPanel {...get('props')} user={get('user')} />
        </QueryClientProvider>
      );

      fireEvent.click(getByLabelText('Kebab toggle'));
      expect(queryByText('Delete').closest('button')).toBeDisabled();
    });
  });
});
