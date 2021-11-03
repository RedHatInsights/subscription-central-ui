import { authenticateUser, getEnvironment, getUserRbacPermissions } from '../platformServices';

beforeEach(() => {
  window.insights = {
    chrome: {
      auth: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getUser: () => {}
      }
    }
  };
});

describe('authenticateUser', () => {
  it('should return a promise with user data', () => {
    window.insights.chrome.auth.getUser = jest.fn().mockResolvedValue({
      identity: {
        user: {
          email: 'john.doe@redhat.com'
        }
      }
    });

    expect(authenticateUser()).resolves.toEqual({
      identity: {
        user: {
          email: 'john.doe@redhat.com'
        }
      }
    });
  });

  it('should throw an error if rejected', () => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => {
      throw new Error('Error getting user');
    });

    try {
      authenticateUser();
    } catch (e) {
      expect(e.message).toEqual('Error authenticating user: Error getting user');
    }
  });
});

describe('getUserRbacPermissions', () => {
  it('should return a promise with user RBAC permissions', () => {
    window.insights.chrome.getUserPermissions = jest.fn().mockResolvedValue([
      { resourceDefinitions: [], permission: 'subscriptions:manifests:read' },
      { resourceDefinitions: [], permission: 'subscriptions:manifests:write' }
    ]);

    expect(getUserRbacPermissions()).resolves.toEqual([
      { resourceDefinitions: [], permission: 'subscriptions:manifests:read' },
      { resourceDefinitions: [], permission: 'subscriptions:manifests:write' }
    ]);
  });

  it('should throw an error if rejected', () => {
    window.insights.chrome.getUserPermissions = jest.fn().mockImplementation(() => {
      throw new Error('Nope');
    });

    try {
      authenticateUser();
    } catch (e) {
      expect(e.message).toEqual('Error getting user permissions: Nope');
    }
  });
});

describe('getEnvironment', () => {
  it('returns the environment', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockReturnValue('qa');

    expect(getEnvironment()).toEqual('qa');
  });

  it('defaults to returning "ci"', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockReturnValue(null);

    expect(getEnvironment()).toEqual('ci');
  });
});
