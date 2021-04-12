import React from 'react';
import { render } from '@testing-library/react';
import NoSearchResults from '../NoSearchResults';

it('renders correctly', () => {
  const { container } = render(<NoSearchResults clearFilters={() => true} />);
  expect(container).toMatchSnapshot();
});
