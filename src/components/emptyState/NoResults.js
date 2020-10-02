import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

const NoResults = ({ clearFilters }) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        No results found
      </Title>
      <EmptyStateBody>
        No results match the filter criteria.
        Remove all filters or clear all filters to show results.
      </EmptyStateBody>
      <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
    </EmptyState>
  );
};

NoResults.propTypes = { clearFilters: PropTypes.func };

export default NoResults;
