import React, { FC } from 'react';
import ManifestEntitlementsList from './ManifestEntitlementsList';
import useManifestEntitlements from '../../hooks/useManifestEntitlements';

interface ManifestEntitlementsListContainerProps {
  uuid: string;
  entitlementsRowRef: React.MutableRefObject<HTMLSpanElement | HTMLParagraphElement>;
}
const ManifestEntitlementsListContainer: FC<ManifestEntitlementsListContainerProps> = ({
  uuid,
  entitlementsRowRef
}) => {
  const { isLoading, isSuccess, isError, data } = useManifestEntitlements(uuid);

  return (
    <ManifestEntitlementsList
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      entitlementsData={data?.body?.entitlementsAttached}
      entitlementsRowRef={entitlementsRowRef}
      uuid={uuid}
    />
  );
};

export default ManifestEntitlementsListContainer;
