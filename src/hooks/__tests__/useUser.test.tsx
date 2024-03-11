import { renderHook, waitFor } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { useAuthenticateUser, useUserRbacPermissions } from '../../utilities/platformServices';
import useUser from '../useUser';
import { createQueryWrapper } from '../../utilities/testHelpers';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

jest.mock('../../utilities/platformServices', () => ({
  ...(jest.requireActual('../../utilities/platformServices') as Record<string, unknown>),
  useAuthenticateUser: jest.fn(),
  useUserRbacPermissions: jest.fn()
}));

describe('useUser hook', () => {
  it('gets the user permissions back from two API calls', async () => {
    (useAuthenticateUser as jest.Mock).mockResolvedValue({
      identity: {
        user: {
          is_org_admin: true
        }
      },
      entitlements: {
        smart_management: { is_entitled: true }
      }
    });

    const mockSCAStatusResponse = {
      body: {
        id: '123456',
        simpleContentAccess: 'enabled',
        simpleContentAccessCapable: true
      }
    };

    (useUserRbacPermissions as jest.Mock).mockResolvedValue([
      { permission: 'subscriptions:manifests:read' },
      { permission: 'subscriptions:manifests:write' }
    ]);

    fetch.mockResponse(JSON.stringify(mockSCAStatusResponse));

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        canReadManifests: true,
        canWriteManifests: true,
        isEntitled: true,
        isOrgAdmin: true,
        isSCACapable: true
      });
      expect(true).toBeTruthy();
    });
  });

  it('does not return anything if the Authenticate User API call fails', async () => {
    const originalError = console.error;
    const mockSCAStatusResponse = {
      body: {
        id: '123456',
        simpleContentAccess: 'enabled',
        simpleContentAccessCapable: true
      }
    };

    fetch.mockResponse(JSON.stringify(mockSCAStatusResponse));
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
    console.error = originalError;
  });
});
