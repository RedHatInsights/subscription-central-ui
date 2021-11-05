import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Drawer, DrawerContent, DrawerContentBody } from '@patternfly/react-core';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';
import useManifestEntitlements from '../../../hooks/useManifestEntitlements';
import useExportSatelliteManifest from '../../../hooks/useExportSatelliteManifest';
import factories from '../../../utilities/factories';
import { get, def } from 'bdd-lazy-var';

jest.mock('../../../hooks/useManifestEntitlements');
jest.mock('../../../hooks/useExportSatelliteManifest');

const queryClient = new QueryClient();

describe('Manifest Detail Side Panel', () => {
  def('scaCapable', () => true);
  def('canWriteManifests', () => true);
  def('user', () =>
    factories.user.build({
      canWriteManifests: get('canWriteManifests'),
      isSCACapable: get('scaCapable')
    })
  );

  const props = {
    isExpanded: true,
    uuid: 'abc123',
    titleRef: null as React.MutableRefObject<HTMLSpanElement>,
    drawerRef: null as React.MutableRefObject<HTMLDivElement>,
    onCloseClick: (): any => undefined,
    exportManifest: (): any => undefined,
    exportManifestButtonIsDisabled: false,
    openCurrentEntitlementsListFromPanel: (): any => undefined,
    deleteManifest: (): any => undefined
  };

  beforeEach(() => {
    queryClient.setQueryData('user', get('user'));
  });

  it('renders with a spinner when loading', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isLoading: true
    }));
    (useExportSatelliteManifest as jest.Mock).mockImplementation(() => ({}));

    const panelContent = <ManifestDetailSidePanel {...props} />;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Drawer isExpanded={true}>
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>foo</DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </QueryClientProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an error occurs', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: true
    }));

    const panelContent = <ManifestDetailSidePanel {...props} />;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Drawer isExpanded={true}>
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>foo</DrawerContentBody>
          </DrawerContent>
        </Drawer>
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

    const panelContent = <ManifestDetailSidePanel {...props} />;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Drawer isExpanded={true}>
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>foo</DrawerContentBody>
          </DrawerContent>
        </Drawer>
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

    const panelContent = <ManifestDetailSidePanel {...props} />;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Drawer isExpanded={true}>
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>foo</DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </QueryClientProvider>
    );

    expect(container).toMatchSnapshot();
  });

  describe('when user is not SCA capable', () => {
    def('scaCapable', () => false);

    it("shows 'administratively disabled' for SCA status", () => {
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

      const panelContent = <ManifestDetailSidePanel {...props} />;

      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <Drawer isExpanded={true}>
            <DrawerContent panelContent={panelContent}>
              <DrawerContentBody>foo</DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </QueryClientProvider>
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('when user does not have write permission', () => {
    def('canWriteManifests', () => false);

    it('does not render the delete button', () => {
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

      const panelContent = <ManifestDetailSidePanel {...props} />;

      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <Drawer isExpanded={true}>
            <DrawerContent panelContent={panelContent}>
              <DrawerContentBody>foo</DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </QueryClientProvider>
      );

      expect(container).toMatchSnapshot();
    });
  });
});
