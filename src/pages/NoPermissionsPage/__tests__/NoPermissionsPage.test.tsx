import React from 'react';
import { render } from '@testing-library/react';
import NoPermissionsPage from '../NoPermissionsPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUser from '../../../hooks/useUser';
import factories from '../../../utilities/factories';
import { def, get } from 'bdd-lazy-var';
import '@testing-library/jest-dom';

jest.mock('../../../hooks/useUser');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/'
  })
}));

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>
      <Provider store={init().getStore()}>
        <Router>
          <NoPermissionsPage />
        </Router>
      </Provider>
    </Authentication>
  </QueryClientProvider>
);

describe('No Permissions Page', () => {
  def('user', () => factories.user.build());

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      data: get('user')
    });

    queryClient.setQueryData(['user'], get('user'));
  });

  it('renders correctly', () => {
    const { getByText } = render(<Page />);
    expect(getByText('You do not have access to Manifests')).toBeInTheDocument();
  });
});
