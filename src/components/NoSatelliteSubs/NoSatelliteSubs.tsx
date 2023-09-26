import { EmptyStateIcon } from '@patternfly/react-core';
import { EmptyState } from '@patternfly/react-core';
import React from 'react';
import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';
import { Title } from '@patternfly/react-core';
import { EmptyStateBody } from '@patternfly/react-core';
import { Text, TextContent } from '@patternfly/react-core';
import { Button } from '@patternfly/react-core';
import { EmptyStateVariant } from '@patternfly/react-core';
import { supportLink, subscriptionInventoryLink } from '../../utilities/consts';

export const NoSatelliteSubs = () => {
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={WrenchIcon} />
      <Title headingLevel="h2" size="lg">
        Your account has no Satellite subscriptions
      </Title>
      <EmptyStateBody>
        <TextContent className="pf-u-mb-xl">
          <Text variant="small">
            A Satellite subscription is required to create a manifest. Contact support to determine
            if you need a new subscription. To view recently expired subscriptions, select the{' '}
            <em>Expired</em> card in your subscription inventory.
          </Text>
        </TextContent>
        <Button variant="primary" component="a" href={supportLink} target="_blank">
          Contact support
        </Button>
        <br />
        <Button variant="link" component="a" href={subscriptionInventoryLink}>
          View subscription inventory
        </Button>
      </EmptyStateBody>
    </EmptyState>
  );
};
