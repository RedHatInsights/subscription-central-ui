import React, { FC } from 'react';
import ManifestDetailDrawer from './ManifestDetailDrawer';
import useManifestEntitlements from '../../hooks/useManifestEntitlements';

interface ManifestDetailDrawerContainerProps {
  uuid: string;
  isExpanded: boolean;
  onExpand: () => void;
  onCloseClick: () => void;
  openCurrentEntitlementsListFromPanel: () => void;
}

const ManifestDetailDrawerContainer: FC<ManifestDetailDrawerContainerProps> = ({
  uuid,
  isExpanded,
  onExpand,
  onCloseClick,
  openCurrentEntitlementsListFromPanel
}) => {
  const { isLoading, isFetching, isSuccess, isError, data } = useManifestEntitlements(uuid);

  return (
    <ManifestDetailDrawer
      isLoading={isLoading}
      isFetching={isFetching}
      isSuccess={isSuccess}
      isError={isError}
      isExpanded={isExpanded}
      onExpand={onExpand}
      onCloseClick={onCloseClick}
      openCurrentEntitlementsListFromPanel={openCurrentEntitlementsListFromPanel}
      manifestData={data?.body}
    />
  );
};
export default ManifestDetailDrawerContainer;
