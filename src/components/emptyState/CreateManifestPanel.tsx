import React, { FC } from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal/CreateManifestButtonWithModal';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { User } from '../../hooks/useUser';

interface CreateManifestButtonWithModalProps {
  user: User;
}

const CreateManifestPanel: FC<CreateManifestButtonWithModalProps> = ({ user }) => {
  return (
    <EmptyState
      headingLevel="h2"
      icon={PlusCircleIcon}
      titleText="Create a new manifest to export subscriptions"
      variant={EmptyStateVariant.lg}
    >
      <EmptyStateBody>
        You currently have no manifests displayed. Create a new manifest to export subscriptions
        from the Red Hat Customer Portal to your on-premise subscription management application.
      </EmptyStateBody>
      <EmptyStateFooter>
        <CreateManifestButtonWithModal user={user} />
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default CreateManifestPanel;
