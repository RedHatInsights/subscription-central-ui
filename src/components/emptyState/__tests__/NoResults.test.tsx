import React from 'react';
import { render } from '@testing-library/react';
import NoSearchResults from '../NoSearchResults';

it('renders correctly', () => {
  const { getByText } = render(<NoSearchResults clearFilters={() => true} />);
  expect(getByText('No results found')).toBeInTheDocument();
});
