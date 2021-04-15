import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestFormLoading from '../CreateManifestFormLoading';

describe('Create Manifest Form Error Message', () => {
  it('renders correctly', () => {
    const { container } = render(<CreateManifestFormLoading title="Loading..." />);
    expect(container).toMatchSnapshot();
  });
});
