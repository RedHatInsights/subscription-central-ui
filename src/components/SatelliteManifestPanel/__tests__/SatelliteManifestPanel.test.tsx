import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import '@testing-library/jest-dom';
import SatelliteManifestPanel from '../SatelliteManifestPanel';
import { ManifestEntry } from '../../../hooks/useSatelliteManifests';
import useSatelliteVersions, { SatelliteVersion } from '../../../hooks/useSatelliteVersions';

jest.mock('../../../hooks/useSatelliteVersions');

const queryClient = new QueryClient();

describe('Satellite Manifest Panel', () => {
  it('renders correctly with SCA column when user is SCA Capable', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];

    const props = {
      data,
      isFetching: false,
      user: { isOrgAdmin: true, isSCACapable: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without SCA column when user is not SCA Capable', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];

    const props = {
      data,
      isFetching: false,
      user: { isOrgAdmin: true, isSCACapable: false }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders no results when there are no results and user is not admin', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const props = {
      data: [] as ManifestEntry[],
      isFetching: false,
      user: { isOrgAdmin: false, isSCACapable: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders a blank state  when there are no results and user is admin', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const props = {
      data: [] as ManifestEntry[],
      isFetching: false,
      user: { isOrgAdmin: true, isSCACapable: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders loading when refetching data', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];

    const props = {
      data,
      isFetching: true,
      user: { isOrgAdmin: true, isSCACapable: true }
    };

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('opens the side panel when the row name is clicked', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];

    const props = {
      data,
      isFetching: false,
      user: { isOrgAdmin: true, isSCACapable: true }
    };

    const { container, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId('expand-details-button-0'));
    expect(container).toMatchSnapshot();
  });

  it('opens the delete popup from clicking the kebab menu', () => {
    (useSatelliteVersions as jest.Mock).mockReturnValue({
      body: [] as SatelliteVersion[]
    });

    const data: ManifestEntry[] = [
      {
        name: 'Sputnik',
        type: 'Satellite',
        url: 'www.example.com',
        uuid: '00000000-0000-0000-0000-000000000000',
        version: '1.2.3',
        entitlementQuantity: 5,
        simpleContentAccess: 'enabled'
      }
    ];

    const props = {
      data,
      isFetching: false,
      user: { isOrgAdmin: true, isSCACapable: true }
    };

    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SatelliteManifestPanel {...props} />
      </QueryClientProvider>
    );

    fireEvent.click(getByLabelText('Actions'));
    fireEvent.click(getByText('Delete'));

    expect(
      screen.queryByText('Deleting a manifest is STRONGLY discouraged. Deleting a manifest will:')
    ).toBeInTheDocument();
  });
});
