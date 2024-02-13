import React, { FC } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader
} from '@patternfly/react-core';
import { Processing } from '../emptyState';

interface CreateManifestFormLoadingProps {
  title: string;
}
const CreateManifestFormLoading: FC<CreateManifestFormLoadingProps> = ({ title }) => {
  return (
    <EmptyState variant={EmptyStateVariant.sm}>
      <EmptyStateHeader titleText={<>{title}</>} headingLevel="h3" />
      <EmptyStateBody>
        <Processing />
      </EmptyStateBody>
    </EmptyState>
  );
};

export default CreateManifestFormLoading;
