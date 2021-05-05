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
  uuid: string;
  onCloseClick: () => void;
  openCurrentEntitlementsListFromPanel: () => void;
}

const ManifestDetailSidePanel: FC<ManifestDetailSidePanelProps> = ({
  uuid,
  onCloseClick,
  openCurrentEntitlementsListFromPanel
}) => {
  const drawerRef = useRef(null);

  const { isLoading, isFetching, isSuccess, isError, data } = useManifestEntitlements(uuid);

  useEffect(() => {
    // This sets focus properly once the API has succeeded
    drawerRef.current && drawerRef.current.focus();
  }, [isSuccess]);

  const DetailsContent = () => {
    // Scenario when API "succeeds" but not with a 200 status
    if (!data?.body) return <ErrorMessage />;

    const {
      uuid,
      name,
      version,
      createdDate,
      createdBy,
      lastModified,
      entitlementsAttachedQuantity,
      contentAccessMode
    } = data.body;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
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
            <p>
              <strong>Name</strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>{name}</p>
          </GridItem>

          <GridItem span={6}>
            <p>
              <strong>Type</strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>Satellite {version}</p>
          </GridItem>

          <GridItem span={6}>
            <p>
              <strong>UUID</strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>{uuid}</p>
          </GridItem>
        </Grid>

        <h4>Subscriptions</h4>

        <Grid>
          <GridItem span={6}>
            <p>
              <strong>
                Simple content access
                <SCAInfoIconWithPopover />
              </strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>{contentAccessMode}</p>
          </GridItem>
          <GridItem span={6}>
            <p>
              <strong>Subscriptions</strong>
            </p>
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
            <p>
              <strong>Created</strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>{formatDate(createdDate)}</p>
          </GridItem>

          <GridItem span={6}>
            <p>
              <strong>Created by</strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>{createdBy}</p>
          </GridItem>

          <GridItem span={6}>
            <p>
              <strong>Last modified date</strong>
            </p>
          </GridItem>
          <GridItem span={6}>
            <p>{formatDate(lastModified)}</p>
          </GridItem>
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
      tabIndex={isSuccess ? 0 : -1}
      ref={drawerRef}
    >
      <Processing />
    </div>
  );

  const ManifestDetailsInnerContent = () => {
    if (isError === true) {
      return <ErrorMessage />;
    }
    if (isLoading === true || isFetching === true) {
      return <Loading />;
    }

    if (isSuccess === true) {
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
