import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestFormLoading from '../CreateManifestFormLoading';

describe('Create Manifest Form Loading Message', () => {
  it('renders correctly', () => {
    const container = render(<CreateManifestFormLoading title="Loading..." />);
    expect(container).toHaveLoader();
  });
  it('renders with a spinner when loading', () => {
    const container = render(<CreateManifestFormLoading title="Loading..." />);
    expect(container).toHaveLoader();
  });
});
