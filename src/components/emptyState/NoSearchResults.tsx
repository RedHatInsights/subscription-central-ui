import React, { FunctionComponent } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateHeader,
  EmptyStateFooter
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

interface NoSearchResultsProps {
  clearFilters: () => void;
}

const NoSearchResults: FunctionComponent<NoSearchResultsProps> = ({ clearFilters }) => {
  return (
    <EmptyState variant={EmptyStateVariant.sm}>
      <EmptyStateHeader
        titleText="No results found"
        icon={<EmptyStateIcon icon={SearchIcon} />}
        headingLevel="h2"
      />
      <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all filters to show
        results.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button variant="link" onClick={clearFilters}>
          Clear all filters
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NoSearchResults;
