import React from 'react';
import useUserPermissions from '../useUserPermissions';
import * as PlatformServices from '../../utilities/platformServices';
import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { createQueryWrapper } from '../../utilities/testHelpers';

jest.mock('../../utilities/platformServices');

enableFetchMocks();

describe('useUserPermissions hook', () => {
  it('gets the user permissions back from two API calls', async () => {
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

    const { result, waitFor } = renderHook(() => useUserPermissions(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ isOrgAdmin: true, isSCACapable: true });
  });

  it('does not return anything if the API call fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const { authenticateUser } = PlatformServices;
    (authenticateUser as jest.Mock).mockRejectedValue({ status: 'error' });

    const { result, waitFor } = renderHook(() => useUserPermissions(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isError);

    expect(result.current.data).toEqual(undefined);
    console.error = originalError;
  });
});
