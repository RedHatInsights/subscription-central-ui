import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import {
  Badge,
  Button,
  Flex,
  FlexItem,
  PageSection,
  Pagination,
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
  sortable
} from '@patternfly/react-table';
import { withCookies, Cookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { NoResults, Processing } from '../emptyState';

const SatelliteManifestPanel = (props) => {
  const [columns] = useState([
    { title: 'Name', transforms: [sortable] },
    { title: 'Version', transforms: [sortable] },
    { title: 'UUID', transforms: [sortable] }
  ]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(3);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState({ index: 0, direction: SortByDirection.asc });
  const { cookies } = props.cookies;

  const { isLoading, data } = useQuery('manifests', () => {
    return (fetch('https://api.access.qa.redhat.com/management/v1/allocations', {
      headers: { Authorization: `Bearer ${cookies.cs_jwt}` },
      mode: 'cors'
    }).then((response) => response.json()).then((data) => {
      return data.body.filter((manifest) => (manifest.type === 'Satellite'));
    }));
  });

  const handlePerPageSelect = (_event, perPage) => {
    setPerPage(perPage);
    setPage(1);
  };

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
    setPage(1);
  };

  const handleSetPage = (_event, page) => {
    setPage(page);
  };

  const clearSearch = () => {
    setSearchValue('');
    setPage(1);
  };

  const handleSort = (_event, index, direction) => {
    setSortBy({ index, direction });
    setPage(1);
  };

  const filteredData = () => {
    return (data.filter(entry => {
      return (
        (entry.name || '').toLowerCase().startsWith(searchValue.toLowerCase()) ||
        (entry.version || '').toLowerCase().startsWith(searchValue.toLowerCase()) ||
        (entry.uuid || '').toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }));
  };

  const filteredRows = () => {
    return (filteredData().map((entry) => {
      return [entry.name || '', entry.version || '', entry.uuid || ''];
    }));
  };

  const sortedRows = () => {
    const { direction, index } = sortBy;
    const directionFactor = direction === SortByDirection.desc ? -1 : 1;

    return (filteredRows().sort((a, b) => {
      const term1 = (a[index] || '').toLowerCase();
      const term2 = (b[index] || '').toLowerCase();
      if (term1 < term2) {
        return -1 * directionFactor;
      } else if (term1 > term2) {
        return 1 * directionFactor;
      } else {
        return 0;
      }
    }));
  };

  const paginatedRows = () => {
    const first = (page - 1) * perPage;
    const last = first + perPage;

    return sortedRows().slice(first, last);
  };

  const count = () => {
    return (isLoading ? 0 : filteredData().length);
  };

  const emptyState = () => {
    if (isLoading) {
      return <Processing />;
    } else if (count() === 0) {
      return <NoResults clearFilters={clearSearch} />;
    } else {
      return '';
    }
  };

  const pagination = (variant = 'top') => {
    return (
      <Pagination
        isDisabled={isLoading}
        itemCount={count()}
        perPage={perPage}
        page={page}
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
        variant={variant}
      />
    );
  };

  const resultCountBadge = () => {
    return (isLoading ? '' : <Badge isRead>{count()}</Badge>);
  };

  return (
    <PageSection variant="light">
      <Title headingLevel="h2">
        Satellite Manifests
        {resultCountBadge()}
      </Title>
      <Flex
        direction={{ default: 'column', md: 'row' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <FlexItem>
          <Split hasGutter>
            <SplitItem isFilled>
              <SearchInput
                value={searchValue}
                onChange={handleSearch}
                onClear={clearSearch}
              />
            </SplitItem>
            <SplitItem>
              <Button variant="primary">New</Button>
            </SplitItem>
          </Split>
        </FlexItem>
        <FlexItem align={{ default: 'alightRight' }}>
          {pagination()}
        </FlexItem>
      </Flex>
      <Table
        aria-label="Satellite Manifest Table"
        cells={columns}
        rows={isLoading ? [] : paginatedRows()}
        sortBy={sortBy}
        onSort={handleSort}
      >
        <TableHeader />
        <TableBody />
      </Table>
      {emptyState()}
      {pagination('bottom')}
    </PageSection>
  );
};

SatelliteManifestPanel.propTypes = {
  cookies: instanceOf(Cookies).isRequired
};

export default withCookies(SatelliteManifestPanel);
