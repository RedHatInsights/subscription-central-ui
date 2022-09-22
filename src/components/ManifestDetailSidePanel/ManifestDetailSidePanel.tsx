import React, { FC, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  Button,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Grid,
  GridItem
} from '@patternfly/react-core';
import { ErrorMessage, Processing } from '../emptyState';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import useManifestEntitlements from '../../hooks/useManifestEntitlements';
import { User } from '../../hooks/useUser';
import './ManifestDetailSidePanel.scss';

interface ManifestDetailSidePanelProps {
  isExpanded: boolean;
  titleRef: React.MutableRefObject<HTMLSpanElement>;
  drawerRef: React.MutableRefObject<HTMLDivElement | HTMLHeadingElement>;
  uuid: string;
  onCloseClick: () => void;
  exportManifest: (uuid: string, manifestName: string) => void;
  exportManifestButtonIsDisabled: boolean;
  openCurrentEntitlementsListFromPanel: () => void;
  deleteManifest: (uuid: string) => void;
}

const ManifestDetailSidePanel: FC<ManifestDetailSidePanelProps> = ({
  isExpanded,
  titleRef,
  drawerRef,
  uuid,
  onCloseClick,
  exportManifest,
  exportManifestButtonIsDisabled,
  openCurrentEntitlementsListFromPanel,
  deleteManifest
}) => {
  const {
    data: entitlementData,
    isLoading: isLoadingEntitlementData,
    isFetching: isFetchingEntitlementData,
    isSuccess: successFetchingEntitlementData,
    isError: errorFetchingEntitlementData
  } = useManifestEntitlements(uuid);

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');

  useEffect(() => {
    if (isExpanded === true) {
      scrollToPageTop();
      focusOnSidePanel();
    }
  }, [isExpanded, successFetchingEntitlementData, isLoadingEntitlementData]);

  const scrollToPageTop = () => {
    if (titleRef?.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const focusOnSidePanel = () => {
    if (drawerRef?.current) {
      drawerRef.current.focus({ preventScroll: true });
    }
  };

  const handleCloseClick = () => {
    onCloseClick();
  };

  const handleExportManifestClick = () => {
    const { uuid, name } = entitlementData.body;
    exportManifest(uuid, name);
    onCloseClick();
  };

  const LoadingDetailsContent = () => (
    <div
      className="sub-manifest-detail-drawer-loading"
      aria-label="Loading Manifest Details"
      tabIndex={isLoadingEntitlementData ? 0 : -1}
      ref={drawerRef}
    >
      <Processing />
    </div>
  );

  const DeleteManifest = () => {
    return (
      <>
        <p className="sub-manifest-details-delete-text">
          Deleting a subscription allocation is <strong>STRONGLY</strong> discouraged. This action
          should only be taken in extreme circumstances or for debugging purposes
        </p>
        <Button
          variant="tertiary"
          onClick={() => {
            deleteManifest(uuid);
          }}
          isDisabled={!user.canWriteManifests}
        >
          Delete manifest
        </Button>
      </>
    );
  };

  const DetailsContent = () => {
    // This handles the scenario when the API "succeeds" but not with a 200 status
    if (!entitlementData?.body) return <ErrorMessage />;

    const {
      uuid,
      name,
      version,
      createdDate,
      createdBy,
      lastModified,
      entitlementsAttachedQuantity,
      simpleContentAccess
    } = entitlementData.body;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
        timeZone: 'America/New_York'
      });
    };

    return (
      <div>
        <h3 tabIndex={successFetchingEntitlementData ? 0 : -1} ref={drawerRef}>
          {name}
        </h3>
        <h4>Details</h4>
        <Grid>
          <GridItem span={6}>
            <strong>Name</strong>
          </GridItem>
          <GridItem span={6}>{name}</GridItem>

          <GridItem span={6}>
            <strong>Type</strong>
          </GridItem>
          <GridItem span={6}>Satellite {version}</GridItem>

          <GridItem span={6}>
            <strong>UUID</strong>
          </GridItem>
          <GridItem span={6}>{uuid}</GridItem>
        </Grid>

        <h4>Subscriptions</h4>
        <Grid>
          <GridItem span={6}>
            <strong>
              Simple content access
              <SCAInfoIconWithPopover />
            </strong>
          </GridItem>
          <GridItem span={6}>
            {user.isSCACapable === true ? simpleContentAccess : 'administratively disabled'}
          </GridItem>

          <GridItem span={6}>
            <strong>Quantity</strong>
          </GridItem>
          <GridItem span={6}>
            <Button
              variant="link"
              onClick={openCurrentEntitlementsListFromPanel}
              className="sub-c-button-manifest-details-open-entitlements"
            >
              {entitlementsAttachedQuantity}
            </Button>
          </GridItem>
        </Grid>

        <h4>History</h4>
        <Grid>
          <GridItem span={6}>
            <strong>Created</strong>
          </GridItem>
          <GridItem span={6}>{formatDate(createdDate)}</GridItem>

          <GridItem span={6}>
            <strong>Created by</strong>
          </GridItem>
          <GridItem span={6}>{createdBy}</GridItem>

          <GridItem span={6}>
            <strong>Last modified date</strong>
          </GridItem>
          <GridItem span={6}>{formatDate(lastModified)}</GridItem>
        </Grid>
        <Button
          variant="tertiary"
          onClick={handleExportManifestClick}
          isDisabled={exportManifestButtonIsDisabled}
        >
          Export manifest
        </Button>
        {user && <DeleteManifest />}
      </div>
    );
  };

  const ManifestDetailsInnerContent = () => {
    if (errorFetchingEntitlementData === true) {
      return <ErrorMessage />;
    } else if (isLoadingEntitlementData === true || isFetchingEntitlementData === true) {
      return <LoadingDetailsContent />;
    } else if (successFetchingEntitlementData === true) {
      return <DetailsContent />;
    }
  };

  return (
    <DrawerPanelContent className="sub-c-drawer__panel-manifest-details">
      <DrawerHead>
        <ManifestDetailsInnerContent />
        <DrawerActions>
          <DrawerCloseButton onClick={handleCloseClick} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );
};

export default ManifestDetailSidePanel;
