import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SCAInfoIconWithPopover from '..';

describe('SCA Info Icon With Popover', () => {
  it('renders the popover properly when the icon is clicked', async () => {
    const { getByTestId } = render(<SCAInfoIconWithPopover />);

    fireEvent.click(getByTestId('sca-more-info-icon'));
    await waitFor(() => getByTestId('sca-more-info-paragraph'));
    expect(document.body).toMatchSnapshot();
  });
});
