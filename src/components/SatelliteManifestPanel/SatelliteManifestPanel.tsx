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
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
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
  const [
    isDeleteManifestConfirmationModalOpen,
    setIsDeleteManifestConfirmationModalOpen
  ] = useState(false);
  const [currentDeletionUUID, setCurrentDeletionUUID] = useState('');
  const [shouldTriggerManifestExport, setShouldTriggerManifestExport] = useState(false);
  const [currentDeletionName, setCurrentDeletionName] = useState('');

  const titleRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement | HTMLHeadingElement>(null);
  const entitlementsRowRefs = new Array(10)
    .fill(null)
    .map(() => useRef<HTMLSpanElement | HTMLParagraphElement>(null));

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
    setTimeout(() => {
      /** Delay to avoid content flicker on animated close
      /* Intentionally longer than child delay in Side Panel, because
      /* otherwise the UUID is lost and query isn't reset.
      */
      setShouldTriggerManifestExport(false);
      setCurrentDetailUUID('');
    }, 300);
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
    setShouldTriggerManifestExport(false);
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

  const panelContent = (
    <ManifestDetailSidePanel
      uuid={currentDetailUUID}
      onCloseClick={closeDetailsPanel}
      isExpanded={detailsDrawerIsExpanded}
      titleRef={titleRef}
      drawerRef={drawerRef}
      openCurrentEntitlementsListFromPanel={openCurrentEntitlementsListFromPanel}
      deleteManifest={openDeleteConfirmationModal}
      shouldTriggerManifestExport={shouldTriggerManifestExport}
    />
  );

  const actions = () => {
    return [
      {
        title: 'Export',
        onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
          openDetailsPanel(rowData.uuid.title, rowId / 2);
          setShouldTriggerManifestExport(true);
        }
      },
      {
        title: 'Delete',
        onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
          openDeleteConfirmationModal(rowData.uuid.title);
        }
      }
    ];
  };

  return (
    <>
      {data?.length === 0 && user.isOrgAdmin && <CreateManifestPanel />}
      {(data?.length > 0 || !user.isOrgAdmin) && (
        <PageSection variant="light">
          <Drawer isExpanded={detailsDrawerIsExpanded}>
            <DrawerContent panelContent={panelContent}>
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
                      {user.isOrgAdmin === true && (
                        <SplitItem>
                          <CreateManifestButtonWithModal />
                        </SplitItem>
                      )}
                    </Split>
                  </FlexItem>
                  <FlexItem align={{ default: 'alignRight' }}>
                    <Pagination
                      isDisabled={isFetching}
                      itemCount={countManifests(data, searchValue)}
                      perPage={perPage}
                      page={page}
                      onSetPage={handleSetPage}
                      onPerPageSelect={handlePerPageSelect}
                      variant={PaginationVariant.top}
                    />
                  </FlexItem>
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
                >
                  <TableHeader />
                  <TableBody />
                </Table>
                {countManifests(data, searchValue) === 0 && data.length > 0 && (
                  <NoSearchResults clearFilters={clearSearch} />
                )}
                {!isFetching && data.length === 0 && <NoManifestsFound />}
                {isFetching && <Processing />}
                <Pagination
                  isDisabled={isFetching}
                  itemCount={countManifests(data, searchValue)}
                  perPage={perPage}
                  page={page}
                  onSetPage={handleSetPage}
                  onPerPageSelect={handlePerPageSelect}
                  variant={PaginationVariant.bottom}
                />
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
