import React, { FunctionComponent, useState } from 'react';
import {
  Badge,
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
  cellWidth
} from '@patternfly/react-table';
import { User } from '../Authentication/UserContext';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import { NoSearchResults } from '../emptyState';
import './SatelliteManifestPanel.scss';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal';
import { NoManifestsFound, Processing } from '../emptyState';

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
    { title: 'Name', transforms: [sortable] },
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
  const [sortBy, setSortBy] = useState({ index: 0, direction: SortByDirection.asc });

  const handlePerPageSelect = (_event: React.MouseEvent, perPage: number) => {
    setPerPage(perPage);
    setPage(1);
  };

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1);
  };

  const handleSetPage = (_event: React.MouseEvent, page: number) => {
    setPage(page);
  };

  const clearSearch = () => {
    setSearchValue('');
    setPage(1);
  };

  const handleSort = (_event: React.MouseEvent, index: number, direction: SortByDirection) => {
    setSortBy({ index, direction });
    setPage(1);
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
    const directionFactor = direction === SortByDirection.desc ? -1 : 1;

    return filteredRows().sort((a: [string, string, string], b: [string, string, string]) => {
      const term1 = (a[index] || '').toLowerCase();
      const term2 = (b[index] || '').toLowerCase();
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

  return (
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
            <SplitItem isFilled>
              <SearchInput
                placeholder="Filter by name, version or UUID"
                value={searchValue}
                onChange={handleSearch}
                onClear={clearSearch}
              />
            </SplitItem>
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
        rows={isFetching ? [] : paginatedRows()}
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
  );
};

export default SatelliteManifestPanel;
