import { renderHook, waitFor } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { useAuthenticateUser } from '../../utilities/platformServices';
import useUser from '../useUser';
import { createQueryWrapper } from '../../utilities/testHelpers';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

jest.mock('../../utilities/platformServices', () => ({
  ...(jest.requireActual('../../utilities/platformServices') as Record<string, unknown>),
  useAuthenticateUser: jest.fn(),
  useToken: jest.fn()
}));

describe('useUser hook', () => {
  it('gets the user status back from API calls', async () => {
    (useAuthenticateUser as jest.Mock).mockResolvedValue({
      identity: {
        user: {
          is_org_admin: true
        }
      }
    });

    fetch.mockResponse(
      JSON.stringify({
        body: {
          id: '123456',
          simpleContentAccess: 'enabled',
          simpleContentAccessCapable: true
        }
      })
    );

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        isOrgAdmin: true,
        isSCACapable: true
      });
    });
  });

  it('does not return anything if the Authenticate User API call fails', async () => {
    fetch.mockResponse(
      JSON.stringify({
        body: {
          id: '123456',
          simpleContentAccess: 'enabled',
          simpleContentAccessCapable: true
        }
      })
    );

    (useAuthenticateUser as jest.Mock).mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 5));
      throw new Error('error');
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(undefined);
    });
  });
});
