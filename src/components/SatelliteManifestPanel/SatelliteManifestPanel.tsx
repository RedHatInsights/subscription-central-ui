import React, { FunctionComponent, useState, useRef } from 'react';
import {
  Badge,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Flex,
  FlexItem,
  PageSection,
  Pagination,
  PaginationVariant,
  SearchInput,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, SortByDirection } from '@patternfly/react-table';
import {
  BooleanDictionary,
  countManifests,
  getTableHeaders,
  getManifestName,
  getRowsWithAllocationDetails
} from './satelliteManifestPanelUtils';
import { User } from '../../hooks/useUser';
import { CreateManifestPanel } from '../../components/emptyState';
import useNotifications from '../../hooks/useNotifications';
import useExportSatelliteManifest from '../../hooks/useExportSatelliteManifest';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import { NoSearchResults } from '../emptyState';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal';
import { NoManifestsFound, Processing } from '../emptyState';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';
import './SatelliteManifestPanel.scss';
import DeleteManifestConfirmationModal from '../DeleteManifestConfirmationModal';

interface SatelliteManifestPanelProps {
  data: ManifestEntry[] | undefined;
  isFetching: boolean;
  user: User;
}

const SatelliteManifestPanel: FunctionComponent<SatelliteManifestPanelProps> = ({
  data,
  isFetching,
  user
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState({ index: 1, direction: SortByDirection.asc });
  const [rowExpandedStatus, setRowExpandedStatus] = useState<BooleanDictionary>({});
  const [currentDetailUUID, setCurrentDetailUUID] = useState('');
  const [detailsDrawerIsExpanded, setDetailsDrawerIsExpanded] = useState(false);
  const [currentDetailRowIndex, setCurrentDetailRowIndex] = useState(null);
  const [isDeleteManifestConfirmationModalOpen, setIsDeleteManifestConfirmationModalOpen] =
    useState(false);
  const [currentDeletionUUID, setCurrentDeletionUUID] = useState('');
  const [currentDeletionName, setCurrentDeletionName] = useState('');
  const [shouldAddExportSuccessNotification, setShouldAddExportSuccessNotification] =
    useState(false);
  const [exportedManifestName, setExportedManifestName] = useState('');
  const [loadingManifestNotificationKey, setLoadingManifestNotificationKey] = useState('');

  const titleRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement | HTMLHeadingElement>(null);
  const entitlementsRowRefs = new Array(10)
    .fill(null)
    .map(() => useRef<HTMLSpanElement | HTMLParagraphElement>(null));

  const { addInfoNotification, addSuccessNotification, addErrorNotification } = useNotifications();

  const {
    data: exportedManifestData,
    mutate: triggerManifestExport,
    isLoading: isLoadingManifestExport,
    isSuccess: successExportingManifest,
    isError: errorExportingManifest
  } = useExportSatelliteManifest();

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

  const openDetailsPanel = (uuid: string, rowIndex: number): void => {
    setCurrentDetailUUID(uuid);
    setCurrentDetailRowIndex(rowIndex);
    setDetailsDrawerIsExpanded(true);
    scrollToPageTop();
    focusOnSidePanel();
  };

  const closeDetailsPanel = () => {
    setDetailsDrawerIsExpanded(false);
    setCurrentDetailUUID('');
  };

  const handlePerPageSelect = (_event: React.MouseEvent, perPage: number) => {
    setPerPage(perPage);
    setPage(1);
  };

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1);
    collapseAllRows();
  };

  const handleSetPage = (_event: React.MouseEvent, page: number) => {
    setPage(page);
    collapseAllRows();
  };

  const clearSearch = () => {
    setSearchValue('');
    setPage(1);
    collapseAllRows();
  };

  const handleSort = (_event: React.MouseEvent, index: number, direction: SortByDirection) => {
    setSortBy({ index, direction });
    setPage(1);
    collapseAllRows();
  };

  const handleDeleteManifestConfirmationModalToggle = () => {
    setIsDeleteManifestConfirmationModalOpen(!isDeleteManifestConfirmationModalOpen);
  };

  const openDeleteConfirmationModal = (uuid: string) => {
    setCurrentDeletionUUID(uuid);
    setCurrentDeletionName(getManifestName(data, uuid));
    handleDeleteManifestConfirmationModalToggle();
  };

  const handleRowManifestClick = (uuid: string, rowIndex: number): void => {
    openDetailsPanel(uuid, rowIndex);
  };

  const toggleRowExpansion = (rowUUID: string, expanded: boolean) => {
    const newRowExpandedStatus = { ...rowExpandedStatus };
    newRowExpandedStatus[rowUUID] = expanded;
    setRowExpandedStatus(newRowExpandedStatus);
  };

  const toggleAllocationDetails = (
    event: React.MouseEvent,
    rowKey: number,
    isOpen: boolean,
    rowData: any
  ) => {
    const uuid: string = rowData.uuid.title;
    toggleRowExpansion(uuid, !rowExpandedStatus[uuid]);
  };

  const openCurrentEntitlementsListFromPanel = () => {
    closeDetailsPanel();
    toggleRowExpansion(currentDetailUUID, true);
    const currentRowRef = entitlementsRowRefs[currentDetailRowIndex];
    if (currentRowRef?.current) {
      currentRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const collapseAllRows = () => {
    setRowExpandedStatus({});
  };

  const exportManifest = (uuid: string, manifestName: string): void => {
    setExportedManifestName(manifestName);
    setShouldAddExportSuccessNotification(true);

    triggerManifestExport({ uuid });

    const infoNotificationKey = addInfoNotification(
      `Manifest ${manifestName} exporting. This may take some time. Please wait.`,
      { hasTimeout: false }
    );

    setLoadingManifestNotificationKey(infoNotificationKey);
  };

  if (successExportingManifest && shouldAddExportSuccessNotification) {
    const downloadURL = window.URL.createObjectURL(exportedManifestData);

    addSuccessNotification(`Manifest ${exportedManifestName} exported`, {
      hasTimeout: false,
      alertLinkHref: downloadURL,
      alertLinkText: 'Download manifest',
      alertLinkIsDownload: true,
      keyOfAlertToReplace: loadingManifestNotificationKey
    });
    setLoadingManifestNotificationKey('');
    setShouldAddExportSuccessNotification(false);
  }

  if (errorExportingManifest && shouldAddExportSuccessNotification) {
    addErrorNotification('Something went wrong. Please refresh the page and try again.', {
      hasTimeout: false,
      keyOfAlertToReplace: loadingManifestNotificationKey
    });
    setLoadingManifestNotificationKey('');
    setShouldAddExportSuccessNotification(false);
  }

  const actions = () => {
    const results = [
      {
        title: 'Export',
        onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
          const manifestName = rowData.cells[0].props.children.props.children;
          const uuid = rowData.uuid.title;
          exportManifest(uuid, manifestName);
        }
      }
    ];
    if (user.canWriteManifests) {
      results.push({
        title: 'Delete',
        onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
          openDeleteConfirmationModal(rowData.uuid.title);
        }
      });
    }
    return results;
  };

  const pagination = (variant = PaginationVariant.top) => {
    return (
      <Pagination
        isDisabled={isFetching}
        itemCount={countManifests(data, searchValue)}
        perPage={perPage}
        page={page}
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
        variant={variant}
      />
    );
  };

  const panelContent = () => {
    if (currentDetailUUID) {
      return (
        <ManifestDetailSidePanel
          uuid={currentDetailUUID}
          exportManifest={exportManifest}
          exportManifestButtonIsDisabled={isLoadingManifestExport}
          onCloseClick={closeDetailsPanel}
          isExpanded={detailsDrawerIsExpanded}
          titleRef={titleRef}
          drawerRef={drawerRef}
          openCurrentEntitlementsListFromPanel={openCurrentEntitlementsListFromPanel}
          deleteManifest={openDeleteConfirmationModal}
        />
      );
    } else {
      return '';
    }
  };

  return (
    <>
      {data?.length === 0 && user.canWriteManifests && <CreateManifestPanel />}
      {(data?.length > 0 || !user.canWriteManifests) && (
        <PageSection variant="light">
          <Drawer isExpanded={detailsDrawerIsExpanded} className="sub-c-drawer-satellite-manifest">
            <DrawerContent panelContent={panelContent()}>
              <DrawerContentBody>
                <Title headingLevel="h2">
                  <span ref={titleRef}>Manifests</span>
                  {!isFetching && <Badge isRead>{countManifests(data, searchValue)}</Badge>}
                </Title>
                <Flex
                  direction={{ default: 'column', md: 'row' }}
                  justifyContent={{ default: 'justifyContentSpaceBetween' }}
                >
                  <FlexItem>
                    <Split hasGutter>
                      {data.length > 0 && (
                        <SplitItem isFilled>
                          <SearchInput
                            placeholder="Filter by name, version or UUID"
                            value={searchValue}
                            onChange={handleSearch}
                            onClear={clearSearch}
                          />
                        </SplitItem>
                      )}
                      {user.canWriteManifests === true && (
                        <SplitItem>
                          <CreateManifestButtonWithModal />
                        </SplitItem>
                      )}
                    </Split>
                  </FlexItem>
                  <FlexItem align={{ default: 'alignRight' }}>{pagination()}</FlexItem>
                </Flex>
                <Table
                  aria-label="Satellite Manifest Table"
                  cells={getTableHeaders(user)}
                  rows={
                    isFetching
                      ? []
                      : getRowsWithAllocationDetails(
                          data,
                          user,
                          searchValue,
                          page,
                          perPage,
                          rowExpandedStatus,
                          handleRowManifestClick,
                          entitlementsRowRefs,
                          sortBy
                        )
                  }
                  onCollapse={toggleAllocationDetails}
                  sortBy={sortBy}
                  onSort={handleSort}
                  actions={actions()}
                  areActionsDisabled={() => isLoadingManifestExport}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
                {countManifests(data, searchValue) === 0 && data.length > 0 && (
                  <NoSearchResults clearFilters={clearSearch} />
                )}
                {!isFetching && data.length === 0 && <NoManifestsFound />}
                {isFetching && <Processing />}
                {pagination(PaginationVariant.bottom)}
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </PageSection>
      )}
      <DeleteManifestConfirmationModal
        uuid={currentDeletionUUID}
        name={currentDeletionName}
        isOpen={isDeleteManifestConfirmationModalOpen}
        handleModalToggle={handleDeleteManifestConfirmationModalToggle}
        onSuccess={closeDetailsPanel}
      />
    </>
  );
};

export default SatelliteManifestPanel;
