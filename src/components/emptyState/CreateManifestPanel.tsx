import React, { FC } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateHeader,
  EmptyStateFooter
} from '@patternfly/react-core';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal/CreateManifestButtonWithModal';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { User } from '../../hooks/useUser';

interface CreateManifestButtonWithModalProps {
  user: User;
}

const CreateManifestPanel: FC<CreateManifestButtonWithModalProps> = ({ user }) => {
  return (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Create a new manifest to export subscriptions"
        icon={<EmptyStateIcon icon={PlusCircleIcon} />}
        headingLevel="h2"
      />
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
