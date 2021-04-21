import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestFormError from '../CreateManifestFormError';

describe('Create Manifest Form Error Message', () => {
  it('renders correctly', () => {
    const { container } = render(<CreateManifestFormError />);
    expect(container).toMatchSnapshot();
  });
});
