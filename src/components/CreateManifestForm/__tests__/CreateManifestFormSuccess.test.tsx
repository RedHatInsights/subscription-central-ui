import React from 'react';
import { render } from '@testing-library/react';
import CreateManifestFormSuccess from '../CreateManifestFormSuccess';

describe('Create Manifest Form Success Message', () => {
  it('renders correctly', () => {
    const props = {
      manifestName: 'new-manifest',
      handleModalToggle: () => 'foo'
    };
    const { container } = render(<CreateManifestFormSuccess {...props} />);
    expect(container).toMatchSnapshot();
  });
});
