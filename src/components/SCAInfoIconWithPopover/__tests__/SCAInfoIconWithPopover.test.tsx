import React from 'react';
import { fireEvent, waitFor, render } from '@testing-library/react';
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
      expect(getByTestId('sca-more-info-paragraph')).toBeDefined();
    });

    expect(testFunctionShouldNotFire).toHaveBeenCalledTimes(0);
  });
});
