import React, { FC } from 'react';
import { EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import { Processing } from '../emptyState';

interface CreateManifestFormLoadingProps {
  title: string;
}
const CreateManifestFormLoading: FC<CreateManifestFormLoadingProps> = ({ title }) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <Title headingLevel="h3">{title}</Title>
      <EmptyStateBody>
        <Processing />
      </EmptyStateBody>
    </EmptyState>
  );
};

export default CreateManifestFormLoading;
