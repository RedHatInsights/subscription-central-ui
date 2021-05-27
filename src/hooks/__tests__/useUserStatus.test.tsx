import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUserStatus from '../useUserStatus';
import * as PlatformServices from '../../utilities/platformServices';
import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

jest.mock('../../utilities/platformServices');

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

const queryClient = new QueryClient();

interface wrapperProps {
  children: ReactNode;
}

const wrapper = ({ children }: wrapperProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUserStatus hook', () => {
  it('gets the user status back from two API calls', async () => {
    // const mockResponse = { body: [{ value: 'sat-6.9', description: 'Satellite 6.9' }] };
    // fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const { authenticateUser } = PlatformServices;

    (authenticateUser as jest.Mock).mockResolvedValue({
      identity: {
        user: {
          is_org_admin: true
        }
      }
    });

    const { result, waitFor } = renderHook(() => useUserStatus(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ isOrgAdmin: true, isSCACapable: true });
  });
});
