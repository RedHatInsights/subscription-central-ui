import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useCreateSatelliteManifest from '../useCreateSatelliteManifest';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { render, fireEvent, waitFor } from '@testing-library/react';

enableFetchMocks();

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();
});

const queryClient = new QueryClient();

describe('useCreateSatelliteManifest hook', () => {
  it('returns success when given correct inputs', async () => {
    const mockResponse = { status: 200 };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const Page = () => {
      const { mutate, isSuccess } = useCreateSatelliteManifest();
      return (
        <div>
          <h1 data-testid="title">{isSuccess && 'Success'}</h1>
          <button onClick={() => mutate({ name: 'my-manifest', version: 'sat-6.2' })}>
            mutate
          </button>
        </div>
      );
    };

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );

    expect(getByTestId('title').textContent).toBe('');
    fireEvent.click(getByText('mutate'));
    await waitFor(() => getByTestId('title'));
    expect(getByTestId('title').textContent).toBe('Success');
  });
});
