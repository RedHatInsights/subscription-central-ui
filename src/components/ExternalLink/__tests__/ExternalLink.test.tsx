import React from 'react';
import { render } from '@testing-library/react';
import ExternalLink from '../ExternalLink';

describe('External Link', () => {
  it('renders correctly with href and text', () => {
    const props = {
      href: 'foo.com',
      children: 'This is text for an external link'
    };

    const container = render(<ExternalLink {...props} />);

    expect(container.queryByText('This is text for an external link')).toHaveAttribute(
      'href',
      'foo.com'
    );
  });
});
