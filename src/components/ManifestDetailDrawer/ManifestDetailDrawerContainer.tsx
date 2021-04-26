import React, { FC } from 'react';
import ManifestDetailDrawer from './ManifestDetailDrawer';
// import useManifestEntitlements from '../../hooks/useManifestEntitlements';

interface ManifestDetailDrawerContainerProps {
  uuid: string;
  isExpanded: boolean;
  onExpand: () => void;
  onCloseClick: () => void;
}

const ManifestDetailDrawerContainer: FC<ManifestDetailDrawerContainerProps> = ({
  uuid,
  isExpanded,
  onExpand,
  onCloseClick
}) => {
  // const { isLoading, isFetching, isSuccess, isError, data } = useManifestEntitlements(uuid);

  /**
   * Mock Data for now
   */

  const isLoading = false;
  const isSuccess = true;
  const isError = false;
  const isFetching = false;
  const data = {
    body: {
      uuid: 'abc123',
      name: 'my-satellite-name',
      type: 'Satellite',
      version: '6.7',
      createdDate: '2017-07-10T14:19:48.000Z',
      createdBy: 'my-username',
      lastModified: '2020-11-05T17:09:18.000Z',
      entitlementsAttachedQuantity: 10,
      entitlementsAttached: {
        valid: true,
        value: [
          {
            contractNumber: '12345',
            entitlementQuantity: 10,
            id: 'id123',
            sku: 'sku123',
            startDate: '2021-01-01T00:00:00.000Z',
            endDate: '2022-01-01T00:00:00.000Z'
          }
        ]
      },
      contentAccessMode: 'Organization Environment Access'
    }
  };

  return (
    <ManifestDetailDrawer
      isLoading={isLoading}
      isFetching={isFetching}
      isSuccess={isSuccess}
      isError={isError}
      isExpanded={isExpanded}
      onExpand={onExpand}
      onCloseClick={onCloseClick}
      manifestData={data?.body}
    />
  );
};
export default ManifestDetailDrawerContainer;
