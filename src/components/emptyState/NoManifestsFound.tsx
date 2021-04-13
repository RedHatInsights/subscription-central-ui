import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

const NoManifestsFound: FunctionComponent = () => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        No manifests found
      </Title>
      <EmptyStateBody>No manifests were found under your account.</EmptyStateBody>
    </EmptyState>
  );
};

export default NoManifestsFound;
