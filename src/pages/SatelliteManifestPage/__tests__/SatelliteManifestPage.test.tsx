import React from 'react';
import { render, screen } from '@testing-library/react';
import SatelliteManifestPage from '../SatelliteManifestPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSatelliteManifests from '../../../hooks/useSatelliteManifests';
import { Relation, useHasRelation } from '../../../hooks/useHasRelation';
import '@testing-library/jest-dom';
import { def, get } from 'bdd-lazy-var';

jest.mock('../../../hooks/useSatelliteManifests');
jest.mock('../../../hooks/useHasRelation');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/'
  })
}));

const queryClient = new QueryClient();

const SatellitePage = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <SatelliteManifestPage />
    </Router>
  </QueryClientProvider>
);

describe('Satellite Manifests Page', () => {
  def('loading', () => false);
  def('error', () => false);
  def('canWriteManifests', () => true);

  beforeEach(() => {
    (useHasRelation as jest.Mock).mockImplementation((relation: Relation) => ({
      has: relation === Relation.MANIFESTS_VIEW ? true : get('canWriteManifests'),
      isLoading: false
    }));
  });

  it('renders correctly with satellite data', async () => {
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
    const { getAllByText } = render(<SatellitePage />);
    getAllByText('Sputnik').forEach((el) => {
      expect(el).toBeInTheDocument();
    });
  });

  describe('when the user status call is still loading', () => {
    def('loading', () => true);
    it('renders loading', () => {
      (useSatelliteManifests as jest.Mock).mockReturnValue({
        isLoading: true,
        data: [],
        error: false,
        isError: false
      });
      const container = render(<SatellitePage />);
      expect(container).toHaveLoader();
    });
  });
  it('renders loading when it has not received a response back', () => {
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
      error: false,
      isError: false
    });
    const container = render(<SatellitePage />);
    expect(container).toHaveLoader();
  });
});

it('renders the empty state when no results are returned', async () => {
  (useSatelliteManifests as jest.Mock).mockReturnValue({
    isLoading: false,
    data: []
  });

  const { getByText } = render(<SatellitePage />);
  expect(getByText('Create a new manifest to export subscriptions')).toBeInTheDocument();
});

describe('when the user does not have write permissions', () => {
  def('canWriteManifests', () => false);

  it('renders an empty table when the API returns no manifests', async () => {
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      data: []
    });

    const { getByText } = render(<SatellitePage />);
    expect(getByText('Create a new manifest to export subscriptions')).toBeInTheDocument();
  });
});

it('renders with an error message when an API fails', async () => {
  (useSatelliteManifests as jest.Mock).mockReturnValue({
    isLoading: false,
    error: true,
    data: undefined
  });
  const container = render(<SatellitePage />);

  expect(container.queryByText('This page is temporarily unavailable').firstChild.textContent);
});

describe('when the user call fails', () => {
  def('error', () => true);

  it('renders an error message', async () => {
    (useSatelliteManifests as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
      data: undefined
    });

    const { getByText } = render(<SatellitePage />);
    expect(getByText('This page is temporarily unavailable')).toBeInTheDocument();
  });
});

it('Renders no access when the user does not have the read permission', () => {
  (useHasRelation as jest.Mock).mockImplementation((relation: Relation) => ({
    has: relation === Relation.MANIFESTS_VIEW ? false : get('canWriteManifests'),
    isLoading: false
  }));

  (useSatelliteManifests as jest.Mock).mockReturnValueOnce({
    isLoading: false,
    data: [],
    error: false,
    isError: false
  });

  render(<SatellitePage />);

  expect(screen.getByText('You do not have access to Manifests')).toBeInTheDocument();
});
