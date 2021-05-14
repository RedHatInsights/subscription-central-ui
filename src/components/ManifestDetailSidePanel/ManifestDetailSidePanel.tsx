import React, { FC, useEffect, useRef } from 'react';
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
import './ManifestDetailSidePanel.scss';

interface ManifestDetailSidePanelProps {
  isExpanded: boolean;
  titleRef: React.MutableRefObject<HTMLSpanElement>;
  drawerRef: React.MutableRefObject<HTMLDivElement | HTMLHeadingElement>;
  uuid: string;
  onCloseClick: () => void;
  openCurrentEntitlementsListFromPanel: () => void;
}

const ManifestDetailSidePanel: FC<ManifestDetailSidePanelProps> = ({
  isExpanded,
  titleRef,
  drawerRef,
  uuid,
  onCloseClick,
  openCurrentEntitlementsListFromPanel
}) => {
  const { isLoading, isFetching, isSuccess, isError, data } = useManifestEntitlements(uuid);

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

  useEffect(() => {
    if (isExpanded === true) {
      scrollToPageTop();
      focusOnSidePanel();
    }
  }, [isExpanded, isSuccess, isLoading]);

  const DetailsContent = () => {
    // This handles the scenario when the API "succeeds" but not with a 200 status
    if (!data?.body) return <ErrorMessage />;

    const {
      uuid,
      name,
      version,
      createdDate,
      createdBy,
      lastModified,
      entitlementsAttachedQuantity,
      simpleContentAccess
    } = data.body;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
        timeZone: 'America/New_York'
      });
    };

    return (
      <div className="manifest-details-content">
        <h3 tabIndex={isSuccess ? 0 : -1} ref={drawerRef}>
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
          <GridItem span={6}>{simpleContentAccess}</GridItem>

          <GridItem span={6}>
            <strong>Quantity</strong>
          </GridItem>
          <GridItem span={6}>
            <Button
              variant="link"
              onClick={openCurrentEntitlementsListFromPanel}
              className="manifest-details-open-entitlements-button"
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
        <Button variant="tertiary">Export manifest</Button>
        <p className="manifest-details-delete-text">
          Deleting a subscription allocation is <strong>STRONGLY</strong> discouraged. This action
          should only be taken in extreme circumstances or for debugging purposes
        </p>
        <Button variant="tertiary">Delete manifest</Button>
      </div>
    );
  };

  const Loading = () => (
    <div
      className="manifest-detail-drawer-loading"
      aria-label="Loading Manifest Details"
      tabIndex={isLoading ? 0 : -1}
      ref={drawerRef}
    >
      <Processing />
    </div>
  );

  const ManifestDetailsInnerContent = () => {
    if (isError === true) {
      return <ErrorMessage />;
    } else if (isLoading === true || isFetching === true) {
      return <Loading />;
    } else if (isSuccess === true) {
      return <DetailsContent />;
    }
  };

  return (
    <DrawerPanelContent>
      <DrawerHead>
        <ManifestDetailsInnerContent />
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );
};

export default ManifestDetailSidePanel;
