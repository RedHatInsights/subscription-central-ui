import React, { FunctionComponent, useState, useRef } from 'react';
import {
  Badge,
  Button,
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
import {
  Table,
  TableHeader,
  TableBody,
  SortByDirection,
  sortable,
  cellWidth,
  expandable
} from '@patternfly/react-table';
import { User } from '../../hooks/useUser';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import { NoSearchResults } from '../emptyState';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal';
import { NoManifestsFound, Processing } from '../emptyState';
import ManifestEntitlementsListContainer from '../ManifestEntitlementsList';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';
import SCAStatusSwitch from '../SCAStatusSwitch';
import './SatelliteManifestPanel.scss';
import DeleteManifestConfirmationModal from '../DeleteManifestConfirmationModal';

interface SatelliteManifestPanelProps {
  data: ManifestEntry[] | undefined;
  isFetching: boolean;
  user: User;
}

interface BooleanDictionary {
  [key: string]: boolean;
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
    setShouldTriggerManifestExport(false);
    setCurrentDetailUUID('');
  };

  const getTableHeaders = () => {
    const tableHeaders = [
      { title: 'Name', transforms: [sortable], cellFormatters: [expandable] },
      { title: 'Version', transforms: [sortable] },
      {
        title: (
          <>
            Simple Content Access
            <SCAInfoIconWithPopover />
          </>
        ),
        transforms: [sortable, cellWidth(20)]
      },
      { title: 'UUID', transforms: [sortable] }
    ];

    if (user.isSCACapable === false) {
      // remove SCA Status column
      tableHeaders.splice(2, 1);
    }
    return tableHeaders;
  };

  const formatRow = (row: string[], rowIndex: number) => {
    const name = row[0];
    const version = row[1];
    const scaStatus = row[2];
    const uuid = row[3];

    const formattedRow = [
      <React.Fragment key={`button-${uuid}`}>
        <Button variant="link" onClick={() => handleRowManifestClick(uuid, rowIndex)}>
          {name}
        </Button>
      </React.Fragment>,
      version,
      <React.Fragment key={`scastatusswitch-${uuid}`}>
        <SCAStatusSwitch scaStatus={scaStatus} uuid={uuid} />
      </React.Fragment>,
      uuid
    ];
    if (user.isSCACapable === false) {
      // remove SCA Status column
      formattedRow.splice(2, 1);
    }
    return formattedRow;
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

  const filteredData = () => {
    return data.filter((entry: ManifestEntry) => {
      return (
        (entry.name || '').toLowerCase().includes(searchValue.toLowerCase().trim()) ||
        (entry.version || '').toLowerCase().includes(searchValue.toLowerCase().trim()) ||
        (entry.uuid || '').toLowerCase().includes(searchValue.toLowerCase().trim())
      );
    });
  };

  const filteredRows = () => {
    return filteredData().map((entry: ManifestEntry) => {
      let scaStatus = entry.simpleContentAccess || 'disabled';
      if (parseFloat(entry.version) <= 6.2) {
        scaStatus = 'disallowed';
      }

      return [entry.name || '', entry.version || '', scaStatus, entry.uuid || ''];
    });
  };

  const sortedRows = () => {
    const { direction, index } = sortBy;
    /**
     * This adjustedIndex is necessary because Patternfly
     * has a strange quirk where, when a table has an
     * onCollapse attribute, its index starts at 1, which throws off
     * the sorting without the adjustment.
     */

    const adjustedIndex = index - 1;
    const directionFactor = direction === SortByDirection.desc ? -1 : 1;

    return filteredRows().sort((a: [string, string, string], b: [string, string, string]) => {
      const term1 = (a[adjustedIndex] || '').toLowerCase();
      const term2 = (b[adjustedIndex] || '').toLowerCase();
      if (term1 < term2) {
        return -1 * directionFactor;
      } else if (term1 > term2) {
        return 1 * directionFactor;
      } else {
        return 0;
      }
    });
  };

  const paginatedRows = () => {
    const first = (page - 1) * perPage;
    const last = first + perPage;

    return sortedRows().slice(first, last);
  };

  const count = () => {
    return filteredData().length;
  };

  const pagination = (variant = PaginationVariant.top) => {
    return (
      <Pagination
        isDisabled={isFetching}
        itemCount={count()}
        perPage={perPage}
        page={page}
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
        variant={variant}
      />
    );
  };

  interface Row {
    cells: (string | JSX.Element | { title: React.ReactNode })[];
    fullWidth?: boolean;
    noPadding?: boolean;
    parent?: number;
    isOpen?: boolean;
  }

  const getManifestName = (uuid: string) => {
    return data.find((entry) => entry.uuid == uuid)?.name;
  };

  const handleDeleteManifestConfirmationModalToggle = () => {
    setIsDeleteManifestConfirmationModalOpen(!isDeleteManifestConfirmationModalOpen);
  };

  const openDeleteConfirmationModal = (uuid: string) => {
    setCurrentDeletionUUID(uuid);
    handleDeleteManifestConfirmationModalToggle();
  };

  const getRowsWithAllocationDetails = () => {
    /**
     * Go through each row and add a toggleable row
     * with details beneath it.
     */

    const tableRows = paginatedRows();

    const rowsWithAllocationDetails: Row[] = [];

    tableRows.forEach((row, i) => {
      const uuid = row[3];
      const isOpen = rowExpandedStatus[uuid] || false;
      const parentIndex = (i + 1) * 2 - 2;
      const expandedContent = isOpen ? (
        <ManifestEntitlementsListContainer
          uuid={uuid}
          entitlementsRowRef={entitlementsRowRefs[i]}
        />
      ) : (
        ''
      );

      const formattedRow = formatRow(row, i);
      // Add original row
      rowsWithAllocationDetails.push({ isOpen, cells: [...formattedRow] });

      // Add details row
      rowsWithAllocationDetails.push({
        parent: parentIndex,
        fullWidth: true,
        noPadding: true,
        cells: [{ title: expandedContent }]
      });
    });

    return rowsWithAllocationDetails;
  };

  const handleRowManifestClick = (uuid: string, rowIndex: number) => {
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
    <PageSection variant="light">
      <Drawer isExpanded={detailsDrawerIsExpanded}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>
            <Title headingLevel="h2">
              <span ref={titleRef}>Manifests</span>
              {!isFetching && <Badge isRead>{count()}</Badge>}
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
              <FlexItem align={{ default: 'alignRight' }}>{pagination()}</FlexItem>
            </Flex>
            <Table
              aria-label="Satellite Manifest Table"
              cells={getTableHeaders()}
              rows={isFetching ? [] : getRowsWithAllocationDetails()}
              onCollapse={toggleAllocationDetails}
              sortBy={sortBy}
              onSort={handleSort}
              actions={actions()}
            >
              <TableHeader />
              <TableBody />
            </Table>
            {count() === 0 && data.length > 0 && <NoSearchResults clearFilters={clearSearch} />}
            {!isFetching && data.length === 0 && <NoManifestsFound />}
            {isFetching && <Processing />}
            {pagination(PaginationVariant.bottom)}
            <DeleteManifestConfirmationModal
              uuid={currentDeletionUUID}
              name={getManifestName(currentDeletionUUID)}
              isOpen={isDeleteManifestConfirmationModalOpen}
              handleModalToggle={handleDeleteManifestConfirmationModalToggle}
              onSuccess={closeDetailsPanel}
            />
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </PageSection>
  );
};

export default SatelliteManifestPanel;
