import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import React from 'react';
import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';

import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { supportLink, subscriptionInventoryLink } from '../../utilities/consts';

export const NoSatelliteSubs = () => {
  return (
    <EmptyState
      headingLevel="h2"
      icon={WrenchIcon}
      titleText="Your account has no Satellite subscriptions"
      variant={EmptyStateVariant.lg}
    >
      <EmptyStateBody>
        <Content className="pf-u-mb-xl">
          <Content component="p">
            A Satellite subscription is required to create a manifest. Contact support to determine
            if you need a new subscription. To view recently expired subscriptions, select the{' '}
            <em>Expired</em> card in your subscription inventory.
          </Content>
        </Content>
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
