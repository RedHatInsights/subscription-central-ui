import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestFormLoading from '../CreateManifestFormLoading';

describe('Create Manifest Form Loading Message', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<CreateManifestFormLoading title="Loading..." />);
    expect(getByRole('progressbar')).toBeInTheDocument();
  });
});
