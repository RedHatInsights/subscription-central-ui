import React from 'react';
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
      page: 1,
      perPage: 3,
      processing: true,
      data: [],
      searchValue: '',
      sortBy: { index: 0, direction: SortByDirection.asc }
    };
    this.handlePerPageSelect = this.handlePerPageSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  fetchData() {
    const { cookies } = this.props.cookies;
    this.setState({ processing: true });
    fetch('https://api.access.qa.redhat.com/management/v1/allocations', {
      headers: { Authorization: `Bearer ${cookies.cs_jwt}` },
      mode: 'cors'
    }).then((response) => response.json()).then((data) => {
      this.setState({
        data: data.body.filter((manifest) => (manifest.type === 'Satellite')),
        processing: false
      });
    });
  }

  componentDidMount() {
    this.fetchData();
  };

  handlePerPageSelect(_event, perPage) {
    this.setState({ perPage }, this.fetchRows);
  }

  handleSearch(searchValue) {
    this.setState({ searchValue, page: 1 });
  }

  handleSetPage(_event, page) {
    this.setState({ page });
  }

  clearSearch() {
    this.setState({ page: 1, searchValue: '' });
  }

  handleSort(_event, index, direction) {
    const { processing } = this.state;
    if (!processing) {
      this.setState({ page: 1, sortBy: { index, direction } });
    }
  }

  filteredData() {
    const { data, searchValue } = this.state;

    return (data.filter(entry => {
      return (
        (entry.name || '').toLowerCase().startsWith(searchValue.toLowerCase()) ||
        (entry.version || '').toLowerCase().startsWith(searchValue.toLowerCase()) ||
        (entry.uuid || '').toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }));
  }

  filteredRows() {
    return (this.filteredData().map((entry) => {
      return [entry.name || '', entry.version || '', entry.uuid || ''];
    }));
  }

  sortedRows() {
    const { direction, index } = this.state.sortBy;
    const directionFactor = direction === SortByDirection.desc ? -1 : 1;

    return (this.filteredRows().sort((a, b) => {
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
  }

  paginatedRows() {
    const { page, perPage } = this.state;
    const first = (page - 1) * perPage;
    const last = first + perPage;

    return this.sortedRows().slice(first, last);
  }

  count() {
    return this.filteredData().length;
  }

  emptyState() {
    const { processing } = this.state;
    if (processing) {
      return <Processing />;
    } else if (this.count() === 0) {
      return <NoResults clearFilters={this.clearSearch} />;
    } else {
      return '';
    }
  }

  pagination(variant = 'top') {
    const { page, perPage, processing } = this.state;
    return (
      <Pagination
        isDisabled={processing}
        itemCount={this.count()}
        perPage={perPage}
        page={page}
        onSetPage={this.handleSetPage}
        onPerPageSelect={this.handlePerPageSelect}
        variant={variant}
      />
    );
  }

  resultCountBadge() {
    const { processing } = this.state;
    return (processing ? '' : <Badge isRead>{this.count()}</Badge>);
  }

  render() {
    const { columns, searchValue, sortBy } = this.state;

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
          rows={this.paginatedRows()}
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

SatelliteManifestPanel.propTypes = {
  cookies: instanceOf(Cookies).isRequired
};

export default withCookies(SatelliteManifestPanel);
