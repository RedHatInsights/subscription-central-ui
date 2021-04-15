import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestFormError from '../CreateManifestFormError';

it('renders correctly', () => {
  const { container } = render(<CreateManifestFormError />);
  expect(container).toMatchSnapshot();
});
