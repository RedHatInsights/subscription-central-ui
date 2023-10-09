import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useAuthenticateUser, useEnvironment, useUserRbacPermissions } from '../platformServices';

jest.mock('@redhat-cloud-services/frontend-components/useChrome');

describe('authenticateUser', () => {
  it('should return a promise with user data', async () => {
    const user = await useAuthenticateUser();
    expect(user.identity.user.email).toEqual('john.doe@redhat.com');
  });

  it('should throw an error if rejected', () => {
    jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
      __esModule: true,
      default: () => ({
        getUser: () => {
          throw new Error('Error getting user');
        }
      })
    }));

    try {
      useAuthenticateUser();
    } catch (e) {
      expect(e.message).toEqual('Error authenticating user: Error getting user');
    }
  });
});

describe('getUserRbacPermissions', () => {
  it('should return a promise with user RBAC permissions', () => {
    expect(useUserRbacPermissions()).resolves.toEqual([
      { resourceDefinitions: [], permission: 'subscriptions:manifests:read' },
      { resourceDefinitions: [], permission: 'subscriptions:manifests:write' }
    ]);
  });

  it('should throw an error if rejected', () => {
    jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
      __esModule: true,
      default: () => ({
        getUserPermissions: () => 'Nope'
      })
    }));

    try {
      useAuthenticateUser();
    } catch (e) {
      expect(e.message).toEqual('Error getting user permissions: Nope');
    }
  });
});

describe('getEnvironment', () => {
  it('returns the environment', () => {
    expect(useEnvironment()).toEqual('qa');
  });

  it('defaults to returning "ci"', () => {
    expect(useEnvironment()).toEqual('ci');
  });
});
