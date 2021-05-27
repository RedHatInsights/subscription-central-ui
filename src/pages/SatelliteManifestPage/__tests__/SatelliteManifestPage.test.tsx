import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SatelliteManifestPage from '../SatelliteManifestPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSatelliteManifests from '../../../hooks/useSatelliteManifests';
import useUserPermissions from '../../../hooks/useUserPermissions';

jest.mock('../../../hooks/useSatelliteManifests');
jest.mock('../../../hooks/useUserPermissions');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/'
  })
}));

const SatellitePage = () => (
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

const mockAuthenticateUser = (isLoading: boolean, orgAdminStatus: boolean) => {
  (useUserPermissions as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: false,
    data: {
      isOrgAdmin: orgAdminStatus,
      isSCACapable: true
    }
  });
};

const queryClient = new QueryClient();

describe('Satellite Manifests Page', () => {
  it('renders correctly with satellite data', async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin);

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

    await waitFor(() => expect(useUserPermissions).toHaveBeenCalledTimes(2));
    expect(container).toMatchSnapshot();
  });

  it('renders loading when it has not received a response back', async () => {
    const isLoading = true;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: true,
      data: []
    });

    const { container } = render(<SatellitePage />);

    expect(container).toMatchSnapshot();
    await waitFor(() => expect(useUserPermissions).toHaveBeenCalledTimes(1));
  });

  it('renders the empty state with Create Manifest button when no results are returned and user is org admin', async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(<SatellitePage />);

    await waitFor(() => expect(useUserPermissions).toHaveBeenCalledTimes(2));

    expect(container).toMatchSnapshot();
  });

  it('renders the empty table with no manifests found message, when no manifests returned via API, and user is not org_admin', async () => {
    const isLoading = false;
    const isOrgAdmin = false;
    mockAuthenticateUser(isLoading, isOrgAdmin);

    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { container } = render(<SatellitePage />);

    await waitFor(() => expect(useUserPermissions).toHaveBeenCalledTimes(2));

    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an API fails', async () => {
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
      data: undefined
    });

    const isLoading = false;
    const isOrgAdmin = false;
    mockAuthenticateUser(isLoading, isOrgAdmin);

    const { container } = render(<SatellitePage />);
    await waitFor(() => expect(useUserPermissions).toHaveBeenCalledTimes(2));
    expect(container).toMatchSnapshot();
  });
});
