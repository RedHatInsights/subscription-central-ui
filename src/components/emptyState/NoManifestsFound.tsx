import React, { FunctionComponent } from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

const NoManifestsFound: FunctionComponent = () => {
  return (
    <EmptyState
      headingLevel="h2"
      icon={SearchIcon}
      titleText="No manifests found"
      variant={EmptyStateVariant.sm}
    >
      <EmptyStateBody>No manifests were found under your account.</EmptyStateBody>
    </EmptyState>
  );
};

export default NoManifestsFound;
