import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('Create Manifest Form Error Message', () => {
  it('renders correctly', () => {
    const { container } = render(<ErrorMessage />);
    expect(container).toMatchSnapshot();
  });
});
