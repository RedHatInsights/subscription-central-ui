import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('Generic Error Message', () => {
  it('renders correctly', () => {
    const { container } = render(<ErrorMessage />);
    expect(container).toMatchSnapshot();
  });
});
