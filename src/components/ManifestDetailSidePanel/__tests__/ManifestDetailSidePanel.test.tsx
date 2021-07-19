import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';
import useManifestEntitlements from '../../../hooks/useManifestEntitlements';
import useExportSatelliteManifest from '../../../hooks/useExportSatelliteManifest';

jest.mock('../../../hooks/useManifestEntitlements');
jest.mock('../../../hooks/useExportSatelliteManifest');

const queryClient = new QueryClient();
queryClient.setQueryData('user', { isSCACapable: true, isOrgAdmin: true });

describe('Manifest Detail Side Panel', () => {
  const props = {
    isExpanded: true,
    uuid: 'abc123',
    titleRef: null as React.MutableRefObject<HTMLSpanElement>,
    drawerRef: null as React.MutableRefObject<HTMLDivElement>,
    onCloseClick: (): any => undefined,
    exportManifest: (): any => undefined,
    openCurrentEntitlementsListFromPanel: (): any => undefined,
    deleteManifest: (): any => undefined
  };

  it('renders with a spinner when loading', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isLoading: true
    }));
    (useExportSatelliteManifest as jest.Mock).mockImplementation(() => ({}));

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ManifestDetailSidePanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an error occurs', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: true
    }));

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ManifestDetailSidePanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when the API response does not have 200 status and no data is returned', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: false,
      isLoading: false,
      isSuccess: true,
      data: {}
    }));

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ManifestDetailSidePanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders successfully with data when data is passed across', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: false,
      isSuccess: true,
      isLoading: false,
      data: {
        body: {
          uuid: 'abc123',
          name: 'John Doe',
          version: '6.9',
          createdDate: '2020-01-01T00:00:00.000Z',
          createdBy: 'Jane Doe',
          lastModified: '2021-01-01T00:00:00.000Z',
          entitlementsAttachedQuantity: 10,
          simpleContentAccess: 'enabled'
        }
      }
    }));

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ManifestDetailSidePanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("shows 'administratively disabled' for SCA status when user is not SCA capable", () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: false,
      isSuccess: true,
      isLoading: false,
      data: {
        body: {
          uuid: 'abc123',
          name: 'John Doe',
          version: '6.9',
          createdDate: '2020-01-01T00:00:00.000Z',
          createdBy: 'Jane Doe',
          lastModified: '2021-01-01T00:00:00.000Z',
          entitlementsAttachedQuantity: 10,
          simpleContentAccess: 'enabled'
        }
      }
    }));

    queryClient.setQueryData('user', { isSCACapable: false, isOrgAdmin: true });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ManifestDetailSidePanel {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
