import React from 'react';
import { render } from '@testing-library/react';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';
import useManifestEntitlements from '../../../hooks/useManifestEntitlements';

jest.mock('../../../hooks/useManifestEntitlements');

describe('Manifest Detail Side Panel', () => {
  const props = {
    isExpanded: true,
    uuid: 'abc123',
    titleRef: null as React.MutableRefObject<HTMLSpanElement>,
    drawerRef: null as React.MutableRefObject<HTMLDivElement>,
    onCloseClick: (): any => undefined,
    openCurrentEntitlementsListFromPanel: (): any => undefined,
    deleteManifest: (): any => undefined
  };

  it('renders with a spinner when loading', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isLoading: true
    }));

    const { container } = render(<ManifestDetailSidePanel {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an error occurs', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: true
    }));

    const { container } = render(<ManifestDetailSidePanel {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when the API response does not have 200 status and no data is returned', () => {
    (useManifestEntitlements as jest.Mock).mockImplementation(() => ({
      isError: false,
      isLoading: false,
      isSuccess: true,
      data: {}
    }));

    const { container } = render(<ManifestDetailSidePanel {...props} />);
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

    const { container } = render(<ManifestDetailSidePanel {...props} />);
    expect(container).toMatchSnapshot();
  });
});
