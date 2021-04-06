import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SatelliteManifestPage from '../SatelliteManifestPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSatelliteManifests from '../../../hooks/useSatelliteManifests';
import * as PlatformServices from '../../../utilities/platformServices';

jest.mock('../../../hooks/useSatelliteManifests');
jest.mock('../../../utilities/platformServices');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/'
  })
}));

const queryClient = new QueryClient();

const mockAuthenticateUser = (orgAdminStatus: boolean) => {
  const { authenticateUser } = PlatformServices;

  return (authenticateUser as jest.Mock).mockResolvedValue({
    identity: {
      user: {
        is_org_admin: orgAdminStatus
      }
    }
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Satellite Manifests Page', () => {
  it('renders correctly with satellite data', async () => {
    window.insights = {};
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

    const orgAdminStatus = true;
    const authenticateUser = mockAuthenticateUser(orgAdminStatus);

    const { container } = render(
      <Authentication>
        <Provider store={init().getStore()}>
          <Router>
            <QueryClientProvider client={queryClient}>
              <SatelliteManifestPage />
            </QueryClientProvider>
          </Router>
        </Provider>
      </Authentication>
    );

    await waitFor(() => expect(authenticateUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });

  it('renders loading when it has not received a response back', async () => {
    window.insights = {};

    const orgAdminStatus = true;
    const authenticateUser = mockAuthenticateUser(orgAdminStatus);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(
      <Authentication>
        <Provider store={init().getStore()}>
          <Router>
            <QueryClientProvider client={queryClient}>
              <SatelliteManifestPage />
            </QueryClientProvider>
          </Router>
        </Provider>
      </Authentication>
    );

    expect(container).toMatchSnapshot();
    await waitFor(() => expect(authenticateUser).toHaveBeenCalledTimes(1));
  });

  it('renders the empty state with Create Manifest button when no results are returned and user is org admin', async () => {
    window.insights = {};

    const orgAdminStatus = true;
    const authenticateUser = mockAuthenticateUser(orgAdminStatus);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(
      <Authentication>
        <Provider store={init().getStore()}>
          <Router>
            <QueryClientProvider client={queryClient}>
              <SatelliteManifestPage />
            </QueryClientProvider>
          </Router>
        </Provider>
      </Authentication>
    );

    await waitFor(() => expect(authenticateUser).toHaveBeenCalledTimes(1));

    expect(container).toMatchSnapshot();
  });

  it('renders the empty state of not authorized, when no results are returned and user is not org admin', async () => {
    window.insights = {};

    const orgAdminStatus = false;
    const authenticateUser = mockAuthenticateUser(orgAdminStatus);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(
      <Authentication>
        <Provider store={init().getStore()}>
          <Router>
            <QueryClientProvider client={queryClient}>
              <SatelliteManifestPage />
            </QueryClientProvider>
          </Router>
        </Provider>
      </Authentication>
    );

    await waitFor(() => expect(authenticateUser).toHaveBeenCalledTimes(1));

    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an API fails', () => {
    window.insights = {};
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
      data: undefined
    });

    const { container } = render(
      <Provider store={init().getStore()}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <SatelliteManifestPage />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
