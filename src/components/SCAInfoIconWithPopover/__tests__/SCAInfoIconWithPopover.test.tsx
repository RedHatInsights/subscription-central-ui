import React from 'react';
import { fireEvent, waitFor, render, screen } from '@testing-library/react';
import SCAInfoIconWithPopover from '..';

describe('SCA Info Icon With Popover', () => {
  it('stops event propagation on click', async () => {
    const testFunctionShouldNotFire = jest.fn();

    const { getByTestId } = render(
      <div onClick={testFunctionShouldNotFire}>
        <SCAInfoIconWithPopover />
      </div>
    );

    fireEvent.click(getByTestId('sca-more-info-icon'));
    await waitFor(() => {
      expect(
        screen.queryByText(
          'Simple content access is a set of capabilities that enables a change in the way Red Hat manages its subscription and entitlement enforcement model. When enabled, you are allowed to consume content on your systems without strict entitlement enforcement.'
        )
      ).toBeDefined();
    });

    expect(testFunctionShouldNotFire).not.toHaveBeenCalled();
  });
});
