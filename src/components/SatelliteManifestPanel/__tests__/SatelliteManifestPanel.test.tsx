import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import SatelliteManifestPanel from '../SatelliteManifestPanel';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';
import useExportSatelliteManifest from '../../../hooks/useExportSatelliteManifest';
import { Relation, useHasRelation } from '../../../hooks/useHasRelation';
import factories from '../../../utilities/factories';
import { def, get } from 'bdd-lazy-var';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSatelliteVersions');
jest.mock('../../../hooks/useExportSatelliteManifest');
jest.mock('../../../hooks/useHasRelation');

beforeAll(() => {
  Object.defineProperty(window.URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(() => 'blob:test-url')
  });
});

const queryClient = new QueryClient();

describe('Satellite Manifest Panel', () => {
  def('canReadManifests', () => true);
  def('canWriteManifests', () => true);
  def('user', () => factories.user.build());

  def('data', () => [
    {
      name: 'Sputnik',
      type: 'Satellite',
      url: 'www.example.com',
      uuid: '00000000-0000-0000-0000-000000000000',
      version: '6.3',
      entitlementQuantity: 5,
      simpleContentAccess: 'enabled'
    }
  ]);

  def('fetching', () => false);

  def('props', () => ({
    data: get('data'),
    isFetching: get('fetching'),
    user: get('user')
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();

    queryClient.setQueryData(['user'], get('user'));

    (useHasRelation as jest.Mock).mockImplementation((relation: Relation) => ({
      has:
        relation === Relation.MANIFESTS_VIEW ? get('canReadManifests') : get('canWriteManifests'),
      isLoading: false
    }));

    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[],
      refetch: jest.fn()
    });

    (useExportSatelliteManifest as jest.Mock).mockReturnValue({
      data: null,
      mutate: jest.fn(),
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false
    });
  });

  describe('when user does not have write permission and there are no results', () => {
    def('canWriteManifests', () => false);
    def('data', () => []);

    it('renders no results', () => {
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
    const { container, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
                
        <SatelliteManifestPanel {...get('props')} />
              
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId('expand-details-button-0'));

    expect(container.querySelector('.sub-c-drawer__panel-manifest-details')).toBeInTheDocument();
  });

  it('opens the delete popup from clicking the kebab menu', () => {
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

  it('triggers export when export is clicked', () => {
    const mutate = jest.fn();

    (useExportSatelliteManifest as jest.Mock).mockReturnValue({
      data: null,
      mutate,
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: false
    });

    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={queryClient}>
              
        <SatelliteManifestPanel {...get('props')} />
            
      </QueryClientProvider>
    );

    fireEvent.click(getByLabelText('Kebab toggle'));
    fireEvent.click(getByText('Export'));

    expect(mutate).toHaveBeenCalledWith({
      uuid: '00000000-0000-0000-0000-000000000000'
    });
  });

  it('opens the side panel when the row name is clicked and shows UUID', () => {
    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
                
        <SatelliteManifestPanel {...get('props')} />
              
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId('expand-details-button-0'));

    expect(getByText('UUID')).toBeInTheDocument();
  });

  describe('when the user does not have write permissions', () => {
    def('canWriteManifests', () => false);

    it('does render the delete button, button is disabled', () => {
      const { queryByText, getByLabelText } = render(
        <QueryClientProvider client={queryClient}>
                    
          <SatelliteManifestPanel {...get('props')} />
                  
        </QueryClientProvider>
      );

      fireEvent.click(getByLabelText('Kebab toggle'));

      expect(queryByText('Delete')?.closest('button')).toBeDisabled();
    });
  });
});
