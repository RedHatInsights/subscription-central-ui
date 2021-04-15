import React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';

const CreateManifestFormError = () => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={ExclamationCircleIcon} color="var(--pf-global--danger-color--100)" />
      <Title headingLevel="h3">Something went wrong</Title>
      <EmptyStateBody>
        <h4>
          Try refreshing the page. If the problem persists, contact your organization administrator
          or visit our <Link to="https://status.redhat.com/">status page</Link> for known outages.
        </h4>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default CreateManifestFormError;
