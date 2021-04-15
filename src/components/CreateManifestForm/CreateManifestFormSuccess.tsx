import React, { FC } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';

interface CreateManifestFormSuccessProps {
  manifestName: string;
  handleModalToggle: any;
}

const CreateManifestFormSuccess: FC<CreateManifestFormSuccessProps> = ({
  manifestName,
  handleModalToggle
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={CheckCircleIcon} color="var(--pf-global--success-color--100)" />
      <Title headingLevel="h3">Success</Title>
      <EmptyStateBody>
        <h4>
          Your new manifest, <strong>{manifestName}</strong>, has been successfully created.
        </h4>
        <Button
          key="close-window"
          variant="primary"
          onClick={handleModalToggle}
          style={{ marginTop: '20px' }}
        >
          Return to page
        </Button>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default CreateManifestFormSuccess;
