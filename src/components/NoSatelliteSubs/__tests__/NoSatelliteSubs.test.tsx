import { render } from '@testing-library/react';
import React from 'react';
import { supportLink, subscriptionInventoryLink } from '../../../utilities/consts';
import { NoSatelliteSubs } from '../NoSatelliteSubs';

it('shows the error message', () => {
  const { getByText } = render(<NoSatelliteSubs />);
  expect(getByText('Your account has no Satellite subscriptions')).toBeInTheDocument();
});

it('links to support', () => {
  const { getByText } = render(<NoSatelliteSubs />);
  expect(getByText('Contact support')).toHaveAttribute('href', supportLink);
});

it('links to subscription inventory', () => {
  const { getByText } = render(<NoSatelliteSubs />);
  expect(getByText('View subscription inventory')).toHaveAttribute(
    'href',
    subscriptionInventoryLink
  );
});
