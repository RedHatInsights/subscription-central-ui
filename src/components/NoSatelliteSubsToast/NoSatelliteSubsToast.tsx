import React from 'react';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { subscriptionInventoryLink, supportLink } from '../../utilities/consts';

export const NoSatelliteSubsToast = () => {
  return (
    <TextContent className="pf-u-mb-xl">
      <Text variant="small">
        A Satellite subscription is required to create a manifest.{''}
        <a href={supportLink} target="_blank" rel="noopener noreferrer">
          Contact support{' '}
        </a>{' '}
        {''}
        to determine if you need a new subscription. To view recently expired subscriptions, select
        the <em>Expired</em> card in your {''}
        <a href={subscriptionInventoryLink} target="_blank" rel="noopener noreferrer">
          subscription inventory.
        </a>
      </Text>
    </TextContent>
  );
};
