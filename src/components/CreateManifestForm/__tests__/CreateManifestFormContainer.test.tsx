import React from 'react';
import CreateManifestFormContainer from '../CreateManifestFormContainer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
const queryClient = new QueryClient();

describe('Create Manifest Form container', () => {
  it('renders loading when data is loading', () => {
    const props = { handleModalToggle: () => 'foo' };
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CreateManifestFormContainer {...props} />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
