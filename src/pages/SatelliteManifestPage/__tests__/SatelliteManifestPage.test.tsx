import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SatelliteManifestPage from '../SatelliteManifestPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSatelliteManifests from '../../../hooks/useSatelliteManifests';
import useUser from '../../../hooks/useUser';
import factories from '../../../utilities/factories';

jest.mock('../../../hooks/useSatelliteManifests');
jest.mock('../../../hooks/useUser');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/'
  })
}));

const queryClient = new QueryClient();

const SatellitePage = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>
      <Provider store={init().getStore()}>
        <Router>
          <SatelliteManifestPage />
        </Router>
      </Provider>
    </Authentication>
  </QueryClientProvider>
);

const mockAuthenticateUser = (isLoading: boolean, orgAdminStatus: boolean, isError: boolean) => {
  (useUser as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: isError,
    data: {
      isOrgAdmin: orgAdminStatus,
      isSCACapable: true
    }
  });

  if (isError === false) {
    queryClient.setQueryData(
      'user',
      factories.user.build({
        isSCACapable: true,
        isOrgAdmin: orgAdminStatus
      })
    );
  }
};

describe('Satellite Manifests Page', () => {
  it('renders correctly with satellite data', async () => {
    window.insights = {};
    const isLoading = false;
    const isOrgAdmin = true;
    const isError = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [
        {
          name: 'Sputnik',
          type: 'Satellite',
          url: 'www.example.com',
          uuid: '00000000-0000-0000-0000-000000000000',
          version: '1.2.3'
        }
      ]
    });

    const { container } = render(<SatellitePage />);

    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });

  it('renders loading when the user status call is still loading', async () => {
    window.insights = {};
    const isLoading = true;
    const isOrgAdmin = true;
    const isError = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
      error: false,
      isError: false
    });

    const { container } = render(<SatellitePage />);

    expect(container).toMatchSnapshot();
    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
  });

  it('renders loading when it has not received a response back', async () => {
    window.insights = {};
    const isLoading = false;
    const isOrgAdmin = true;
    const isError = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
      error: false,
      isError: false
    });

    const { container } = render(<SatellitePage />);

    expect(container).toMatchSnapshot();
    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
  });

  it('renders the empty state with Create Manifest button when no results are returned and user is org admin', async () => {
    window.insights = {};
    const isLoading = false;
    const isOrgAdmin = true;
    const isError = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(<SatellitePage />);

    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));

    expect(container).toMatchSnapshot();
  });

  it('renders the empty table with no manifests found message, when no manifests returned via API, and user is not org_admin', async () => {
    window.insights = {};
    const isLoading = false;
    const isOrgAdmin = false;
    const isError = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(<SatellitePage />);

    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));

    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an API fails', async () => {
    window.insights = {};
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
      data: undefined
    });

    const isLoading = false;
    const isOrgAdmin = false;
    const isError = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    const { container } = render(<SatellitePage />);
    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });

  it('renders an error message when user call fails', async () => {
    window.insights = {};
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
      data: undefined
    });

    const isLoading = false;
    const isOrgAdmin = false;
    const isError = true;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    const { container } = render(<SatellitePage />);
    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });
});
