import React from 'react';
import { render } from '@testing-library/react';
import EmptyTable from '../EmptyTable';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

it('renders correctly', () => {
  const { container } = render(
    <EmptyTable
      title="Test Title"
      body="Test Body"
      icon={SearchIcon}
      hasButton={true}
      buttonText="Button text"
      buttonLink="/"
    />
  );
  expect(container).toMatchSnapshot();
});
