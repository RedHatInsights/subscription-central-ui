import React from 'react';
import { render } from '@testing-library/react';
import SatelliteManifestPage from '../SatelliteManifestPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSatelliteManifests from '../../../hooks/useSatelliteManifests';

jest.mock('../../../hooks/useSatelliteManifests');

const queryClient = new QueryClient();

describe('Satellite Manifests Page', () => {
  it('renders correctly with satellite data', () => {
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

  it('renders the empty state with create manifest button when no results are returned', () => {
    window.insights = {};
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
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
