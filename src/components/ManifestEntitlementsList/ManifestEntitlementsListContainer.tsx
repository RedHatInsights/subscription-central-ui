import React, { FC } from 'react';
import ManifestEntitlementsList from './ManifestEntitlementsList';
import useManifestEntitlements from '../../hooks/useManifestEntitlements';

interface ManifestEntitlementsListContainerProps {
  uuid: string;
}
const ManifestEntitlementsListContainer: FC<ManifestEntitlementsListContainerProps> = ({
  uuid
}) => {
  const { isLoading, isSuccess, isError, data } = useManifestEntitlements(uuid);

  return (
    <ManifestEntitlementsList
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      entitlementsData={data?.body?.entitlementsAttached}
    />
  );
};

export default ManifestEntitlementsListContainer;
