import React from 'react';
import { render } from '@testing-library/react';
import NoResults from '../NoResults';

it('renders correctly', () => {
  const { container } = render(<NoResults clearFilters={() => true} />);
  expect(container).toMatchSnapshot();
});
