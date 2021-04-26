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
// import { EntitlementsAttachedData, ManifestEntitlement } from '../../hooks/useManifestEntitlements';

interface ManifestDetailDrawerProps {
  manifestData: any; // EntitlementsAttachedData;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onCloseClick: () => void;
}

const ManifestDetailDrawer: FC<ManifestDetailDrawerProps> = ({
  manifestData,
  isLoading,
  isFetching,
  isSuccess,
  isError,
  isExpanded,
  onExpand,
  onCloseClick
}) => {
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

  const DetailsContent = () => (
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
        <GridItem span={6}>{entitlementsAttachedQuantity}</GridItem>
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

  return (
    <DrawerPanelContent>
      <DrawerHead>
        {isLoading && <Processing />}
        {isFetching && <Processing />}
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
