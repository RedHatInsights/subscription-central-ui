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
import { User } from '../Authentication/UserContext';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import { NoSearchResults } from '../emptyState';
import './SatelliteManifestPanel.scss';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal';
import { NoManifestsFound, Processing } from '../emptyState';
import ManifestEntitlementsListContainer from '../ManifestEntitlementsList';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';

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
  const [columns] = useState([
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
  ]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState({ index: 1, direction: SortByDirection.asc });
  const [rowExpandedStatus, setRowExpandedStatus] = useState(new Array(10).fill(false));
  const [currentDetailUUID, setCurrentDetailUUID] = useState('');
  const [detailsDrawerIsExpanded, setDetailsDrawerIsExpanded] = useState(false);
  const [currentDetailRowIndex, setCurrentDetailRowIndex] = useState(null);

  const drawerRef = useRef(null);

  const openDetailsPanel = (uuid: string, rowIndex: number): void => {
    setCurrentDetailUUID(uuid);
    setCurrentDetailRowIndex(rowIndex);
    setDetailsDrawerIsExpanded(true);
  };

  const closeDetailsPanel = () => {
    setCurrentDetailUUID('');
    setDetailsDrawerIsExpanded(false);
  };

  const formatRow = (row: string[], rowIndex: number) => {
    const name: string = row[0];
    const version = `${row[1]}`;
    const scaStatus: string = row[2];
    const uuid: string = row[3];

    return [
      <>
        <Button variant="link" onClick={() => openDetailsPanel(uuid, rowIndex)}>
          {name}
        </Button>
      </>,
      version,
      scaStatus,
      uuid
    ];
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
      return [
        entry.name || '',
        entry.version || '',
        entry.simpleContentAccess || '',
        entry.uuid || ''
      ];
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
    cells: any; // (string | JSX.Element)[] | { title: '' | React.ReactNode }[];
    fullWidth?: boolean;
    noPadding?: boolean;
    parent?: number;
    isOpen?: boolean;
  }

  const getRowsWithAllocationDetails = () => {
    /**
     * Go through each row and add a toggleable row
     * with details beneath it.
     */

    const tableRows = paginatedRows();

    const rowsWithAllocationDetails: Row[] = [];

    tableRows.forEach((row, i) => {
      const isOpen = rowExpandedStatus[i];
      const uuid = row[3];
      const parentIndex = (i + 1) * 2 - 2;
      const expandedContent = isOpen ? <ManifestEntitlementsListContainer uuid={uuid} /> : '';

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

  const toggleAllocationDetails = (event: React.MouseEvent, rowKey: number, isOpen: boolean) => {
    const rowIndexToUpdate = rowKey / 2;
    const newRowExpandedStatus = [...rowExpandedStatus];
    newRowExpandedStatus[rowIndexToUpdate] = isOpen;
    setRowExpandedStatus(newRowExpandedStatus);
  };

  const openCurrentEntitlementsListFromPanel = () => {
    closeDetailsPanel();

    const newRowExpandedStatus = [...rowExpandedStatus];
    newRowExpandedStatus[currentDetailRowIndex] = true;
    setRowExpandedStatus(newRowExpandedStatus);
  };

  const collapseAllRows = () => {
    const newRowExpandedStatus = new Array(10).fill(false);
    setRowExpandedStatus(newRowExpandedStatus);
  };

  // The ternary here is to avoid calling the API when collapsed.
  const panelContent = detailsDrawerIsExpanded ? (
    <ManifestDetailSidePanel
      uuid={currentDetailUUID}
      onCloseClick={closeDetailsPanel}
      openCurrentEntitlementsListFromPanel={openCurrentEntitlementsListFromPanel}
    />
  ) : (
    <></>
  );

  return (
    <Drawer isExpanded={detailsDrawerIsExpanded}>
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>
          <PageSection variant="light">
            <Title headingLevel="h2">
              Satellite Manifests
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
              cells={columns}
              rows={isFetching ? [] : getRowsWithAllocationDetails()}
              onCollapse={toggleAllocationDetails}
              sortBy={sortBy}
              onSort={handleSort}
            >
              <TableHeader />
              <TableBody />
            </Table>
            {count() === 0 && data.length > 0 && <NoSearchResults clearFilters={clearSearch} />}
            {!isFetching && data.length === 0 && <NoManifestsFound />}
            {isFetching && <Processing />}
            {pagination(PaginationVariant.bottom)}
          </PageSection>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SatelliteManifestPanel;
