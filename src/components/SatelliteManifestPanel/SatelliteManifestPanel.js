import React from 'react';
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
import { getSatelliteManifest } from '../../services/mockApi';
import { NoResults, Processing } from '../emptyState';

class SatelliteManifestPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Name', transforms: [sortable] },
        { title: 'Version', transforms: [sortable] },
        { title: 'UUID', transforms: [sortable] }
      ],
      count: 0,
      page: 1,
      perPage: 3,
      processing: true,
      rows: [],
      searchValue: '',
      searchTerm: '',
      sortBy: { index: 0, direction: SortByDirection.asc }
    };
    this.handlePerPageSelect = this.handlePerPageSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  fetchRows() {
    const { page, perPage, searchTerm, sortBy } = this.state;
    const key = ['name', 'version', 'uuid'][sortBy.index];
    // Temporary timer to simulate wating for the api call
    this.setState({ processing: true, rows: [] });
    setTimeout(() => {
      const paginatedData = getSatelliteManifest({
        page,
        perPage,
        searchTerm,
        sortBy: key,
        sortByDirection: sortBy.direction
      });
      this.setState({
        count: paginatedData.quantity,
        processing: false,
        rows: paginatedData.data.map(entry => {
          return [entry.name, entry.version, entry.uuid];
        })
      });
    }, 1500);
  }

  componentDidMount() {
    this.fetchRows();
  };

  handlePerPageSelect(_event, perPage) {
    this.setState({ perPage }, this.fetchRows);
  }

  handleSearch(searchValue) {
    if (this.search) {
      clearTimeout(this.search);
    }

    this.setState({ searchValue });
    this.search = setTimeout(() => {
      this.setState({ searchTerm: searchValue, page: 1 }, this.fetchRows);
      this.search = null;
    }, 1000);
  }

  handleSetPage(_event, page) {
    this.setState({ page }, this.fetchRows);
  }

  clearSearch() {
    this.setState({ page: 1, searchValue: '', searchTerm: '' }, this.fetchRows);
  }

  handleSort(_event, index, direction) {
    const { processing } = this.state;
    if (!processing) {
      this.setState({ page: 1, sortBy: { index, direction } }, this.fetchRows);
    }
  }

  emptyState() {
    const { processing, count } = this.state;
    if (processing) {
      return <Processing />;
    } else if (count === 0) {
      return <NoResults clearFilters={this.clearSearch} />;
    } else {
      return '';
    }
  }

  pagination(variant = 'top') {
    const { count, page, perPage, processing } = this.state;
    return (
      <Pagination
        isDisabled={processing}
        itemCount={count}
        perPage={perPage}
        page={page}
        onSetPage={this.handleSetPage}
        onPerPageSelect={this.handlePerPageSelect}
        variant={variant}
      />
    );
  }

  resultCountBadge() {
    const { count, processing } = this.state;
    return (processing ? '' : <Badge isRead>{count}</Badge>);
  }

  render() {
    const { columns, rows, searchValue, sortBy } = this.state;
    return (
      <PageSection variant="light">
        <Title headingLevel="h2">
          Satellite Manifests
          {this.resultCountBadge()}
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
                  onChange={this.handleSearch}
                  onClear={this.clearSearch}
                />
              </SplitItem>
              <SplitItem>
                <Button variant="primary">New</Button>
              </SplitItem>
            </Split>
          </FlexItem>
          <FlexItem align={{ default: 'alightRight' }}>
            {this.pagination()}
          </FlexItem>
        </Flex>
        <Table
          aria-label="Satellite Manifest Table"
          cells={columns}
          rows={rows}
          sortBy={sortBy}
          onSort={this.handleSort}
        >
          <TableHeader />
          <TableBody />
        </Table>
        {this.emptyState()}
        {this.pagination('bottom')}
      </PageSection>
    );
  }
}

export default SatelliteManifestPanel;
