import React, { FC, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import {
  Button,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Grid,
  GridItem,
  Title
} from '@patternfly/react-core';
import ArrowLeftIcon from '@patternfly/react-icons/dist/js/icons/arrow-left-icon';
import { ErrorMessage, Processing } from '../emptyState';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import useManifestEntitlements from '../../hooks/useManifestEntitlements';
import { User } from '../../hooks/useUser';
import useExportSatelliteManifest from '../../hooks/useExportSatelliteManifest';
import './ManifestDetailSidePanel.scss';

interface ManifestDetailSidePanelProps {
  isExpanded: boolean;
  shouldTriggerManifestExport: boolean;
  titleRef: React.MutableRefObject<HTMLSpanElement>;
  drawerRef: React.MutableRefObject<HTMLDivElement | HTMLHeadingElement>;
  uuid: string;
  onCloseClick: () => void;
  openCurrentEntitlementsListFromPanel: () => void;
  deleteManifest: (uuid: string) => void;
}

const ManifestDetailSidePanel: FC<ManifestDetailSidePanelProps> = ({
  isExpanded,
  shouldTriggerManifestExport,
  titleRef,
  drawerRef,
  uuid,
  onCloseClick,
  openCurrentEntitlementsListFromPanel,
  deleteManifest
}) => {
  const [exportDownloadURL, setExportDownloadURL] = useState('');
  const [hasReturnedToDetails, setHasReturnedToDetails] = useState(false);

  const {
    data: entitlementData,
    isLoading: isLoadingEntitlementData,
    isFetching: isFetchingEntitlementData,
    isSuccess: successFetchingEntitlementData,
    isError: errorFetchingEntitlementData
  } = useManifestEntitlements(uuid);

  const shouldExportManifestOnRender = shouldTriggerManifestExport && !hasReturnedToDetails;
  const {
    data: exportedManifestData,
    isFetching: isFetchingManifestExport,
    refetch: exportManifest,
    isError: errorExportingManifest,
    isSuccess: successExportingManifest,
    remove: resetExportManifestDataQuery
  } = useExportSatelliteManifest(uuid, shouldExportManifestOnRender);

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');

  useEffect(() => {
    if (isExpanded === true) {
      scrollToPageTop();
      focusOnSidePanel();
    }
  }, [
    isExpanded,
    successFetchingEntitlementData,
    isLoadingEntitlementData,
    isFetchingManifestExport,
    successExportingManifest
  ]);

  const scrollToPageTop = () => {
    if (titleRef?.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const returnToDetails = () => {
    resetExportManifestDataQuery();
    setHasReturnedToDetails(true);
  };

  if (successExportingManifest === true && hasReturnedToDetails === true) {
    setHasReturnedToDetails(false);
  }

  const focusOnSidePanel = () => {
    if (drawerRef?.current) {
      drawerRef.current.focus({ preventScroll: true });
    }
  };

  if (successExportingManifest === true && exportDownloadURL?.length === 0) {
    setExportDownloadURL(window.URL.createObjectURL(exportedManifestData));
  }

  const handleCloseClick = () => {
    onCloseClick();

    if (exportDownloadURL.length) {
      window.URL.revokeObjectURL(exportDownloadURL);
      setExportDownloadURL('');
    }

    setTimeout(() => {
      // Delay to avoid content flicker on animated close
      resetExportManifestDataQuery();
    }, 200);
  };

  const LoadingDetailsContent = () => (
    <div
      className="manifest-detail-drawer-loading"
      aria-label="Loading Manifest Details"
      tabIndex={isLoadingEntitlementData ? 0 : -1}
      ref={drawerRef}
    >
      <Processing />
    </div>
  );

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
      <div className="manifest-details-content">
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
        <Button variant="tertiary" onClick={exportManifest}>
          Export manifest
        </Button>
        <p className="manifest-details-delete-text">
          Deleting a subscription allocation is <strong>STRONGLY</strong> discouraged. This action
          should only be taken in extreme circumstances or for debugging purposes
        </p>
        <Button
          variant="tertiary"
          onClick={() => {
            deleteManifest(uuid);
          }}
        >
          Delete manifest
        </Button>
      </div>
    );
  };

  const LoadingExportingManifestMessage = () => (
    <EmptyState variant={EmptyStateVariant.small}>
      <Title headingLevel="h3" ref={drawerRef} tabIndex={isFetchingManifestExport ? 0 : -1}>
        Exporting manifest. Please wait
      </Title>
      <EmptyStateBody>
        <Processing />
      </EmptyStateBody>
    </EmptyState>
  );

  const SuccessExportingManifestMessage = () => (
    <EmptyState variant={EmptyStateVariant.small}>
      <Title headingLevel="h3" ref={drawerRef} tabIndex={successExportingManifest ? 0 : -1}>
        Manifest exported successfully.
      </Title>
      <EmptyStateBody>
        <div className="manifest-details-download-manifest">
          <a href={exportDownloadURL} download>
            <Button variant="primary">Download Manifest</Button>
          </a>
          <Button style={{ marginTop: '10px' }} variant="link" onClick={returnToDetails}>
            <ArrowLeftIcon style={{ marginRight: '7px' }} />
            Back to details
          </Button>
        </div>
      </EmptyStateBody>
    </EmptyState>
  );

  const ManifestDetailsInnerContent = () => {
    if (errorFetchingEntitlementData === true || errorExportingManifest === true) {
      return <ErrorMessage />;
    } else if (isFetchingManifestExport === true) {
      return <LoadingExportingManifestMessage />;
    } else if (successExportingManifest === true) {
      return <SuccessExportingManifestMessage />;
    } else if (isLoadingEntitlementData === true || isFetchingEntitlementData === true) {
      return <LoadingDetailsContent />;
    } else if (successFetchingEntitlementData === true) {
      return <DetailsContent />;
    }
  };

  return (
    <DrawerPanelContent>
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
