import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { authenticateUser } from '../../utilities/platformServices';
import useUser from '../useUser';
import { createQueryWrapper } from '../../utilities/testHelpers';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

jest.mock('../../utilities/platformServices', () => ({
  ...jest.requireActual('../../utilities/platformServices'),
  authenticateUser: jest.fn()
}));

describe('useUser hook', () => {
  it('gets the user permissions back from two API calls', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({
      identity: {
        user: {
          is_org_admin: true
        }
      }
    });

    const mockSCAStatusResponse = {
      body: {
        id: '123456',
        simpleContentAccess: 'enabled',
        simpleContentAccessCapable: true
      }
    };

    fetch.mockResponseOnce(JSON.stringify(mockSCAStatusResponse));

    const { result, waitFor } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ isOrgAdmin: true, isSCACapable: true });
  });

  it('does not return anything and sets react-query status as isError if the Authenticate User API call fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    (authenticateUser as jest.Mock).mockRejectedValue({ status: 'error' });

    const { result, waitFor } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isError);

    expect(result.current.data).toEqual(undefined);
    console.error = originalError;
  });
});
