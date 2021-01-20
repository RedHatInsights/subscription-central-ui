import React from 'react';
import { render } from '@testing-library/react';
import Processing from '../Processing';

it('renders correctly', () => {
  const { container } = render(<Processing />);
  expect(container).toMatchSnapshot();
});
