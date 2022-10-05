import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('Generic Error Message', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ErrorMessage />);
    expect(getByText('Something went wrong')).toBeInTheDocument();
  });
});
