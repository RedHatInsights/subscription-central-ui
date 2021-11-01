import React from 'react';
import { render, waitFor } from '@testing-library/react';
import OopsPage from '../OopsPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';
import factories from '../../../utilities/factories';
import { get, def } from 'bdd-lazy-var';

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
          <OopsPage />
        </Router>
      </Provider>
    </Authentication>
  </QueryClientProvider>
);

describe('Oops Page', () => {
  def('user', () => factories.user.build());

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      data: get('user')
    });

    queryClient.setQueryData('user', get('user'));
  });

  it('renders correctly', async () => {
    window.insights = {};

    const { container } = render(<Page />);

    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });
});
