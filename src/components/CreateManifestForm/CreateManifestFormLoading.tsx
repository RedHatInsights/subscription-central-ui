import React, { FC } from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Processing } from '../emptyState';

interface CreateManifestFormLoadingProps {
  title: string;
}
const CreateManifestFormLoading: FC<CreateManifestFormLoadingProps> = ({ title }) => {
  return (
    <EmptyState headingLevel="h3" titleText={<>{title}</>} variant={EmptyStateVariant.sm}>
      <EmptyStateBody>
        <Processing />
      </EmptyStateBody>
    </EmptyState>
  );
};

export default CreateManifestFormLoading;
