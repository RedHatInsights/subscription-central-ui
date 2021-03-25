import React, { FC } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';

import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

const NoSatelliteManifests: FC = () => {
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h5" size="lg">
        Create a new manifest to export subscriptions
      </Title>
      <EmptyStateBody>
        You currently have no manifests displayed. Create a new manifest to export subscriptions
        from the Red Hat Customer Portal to your on-premise subscription management application.
      </EmptyStateBody>
      <Button variant="primary">Create new manifest</Button>
    </EmptyState>
  );
};

export default NoSatelliteManifests;
