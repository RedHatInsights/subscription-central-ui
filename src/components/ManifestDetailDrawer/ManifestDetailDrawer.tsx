import React, { FC } from 'react';
import {
  Button,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Grid,
  GridItem
} from '@patternfly/react-core';
import { Processing } from '../emptyState';
import './ManifestDetailDrawer.scss';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';

interface ManifestDetailDrawerProps {
  manifestData: any;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onCloseClick: () => void;
  openCurrentEntitlementsListFromPanel: () => void;
}

const ManifestDetailDrawer: FC<ManifestDetailDrawerProps> = ({
  manifestData,
  isLoading,
  isFetching,
  isSuccess,
  isError,
  isExpanded,
  onExpand,
  onCloseClick,
  openCurrentEntitlementsListFromPanel
}) => {
  const DetailsContent = () => {
    if (!manifestData) return;

    const {
      uuid,
      name,
      type,
      version,
      createdDate,
      createdBy,
      lastModified,
      entitlementsAttachedQuantity,
      contentAccessMode
    } = manifestData;

    return (
      <div className="manifest-details-content">
        <h3>{name}</h3>
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
            <Button variant="link" onClick={openCurrentEntitlementsListFromPanel}>
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
            <p>{createdDate}</p>
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
            <p>{lastModified}</p>
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
    <div className="manifest-detail-drawer-loading">
      <Processing />
    </div>
  );

  return (
    <DrawerPanelContent>
      <DrawerHead>
        {isLoading && <Loading />}
        {isFetching && !isLoading && <Loading />}
        {isSuccess && <DetailsContent />}
        {isError && 'Something went wrong.  Please refresh the page and try again.'}
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );
};

export default ManifestDetailDrawer;
