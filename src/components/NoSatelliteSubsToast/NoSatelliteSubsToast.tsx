import React from 'react';
import { AlertGroup } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertActionCloseButton } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { subscriptionInventoryLink, supportLink } from '../../utilities/consts';
export const NoSatelliteSubsToast = ({ onClose }: { onClose: () => void }) => {
  return (
    <AlertGroup isToast>
      <Alert
        isLiveRegion
        variant="danger"
        ouiaId="DangerAlert"
        title="Your account has no Satellite subscriptions"
        actionClose={
          <AlertActionCloseButton
            title="Your account has no Satellite subscriptions"
            variantLabel="danger alert"
            onClose={onClose}
          />
        }
      >
        <TextContent>
          <Text>
            A Satellite subscription is required to create a manifest.{' '}
            <a href={supportLink} target="_blank" rel="noopener noreferrer">
              Contact support
            </a>{' '}
            to determine if you need a new subscription. To view recently expired subscriptions,
            select the <em>Expired</em> card in your{' '}
            <a href={subscriptionInventoryLink} target="_blank" rel="noopener noreferrer">
              subscription inventory.
            </a>
          </Text>
        </TextContent>
      </Alert>
    </AlertGroup>
  );
};
