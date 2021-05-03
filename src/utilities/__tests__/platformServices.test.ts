import { authenticateUser, getConfig } from '../platformServices';

beforeEach(() => {
  jest.clearAllMocks();
  window.insights = {
    chrome: {
      auth: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getUser: () => {}
      }
    }
  };
});

describe('Authenticate User method', () => {
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
    window.insights.chrome.auth.getUser = jest.fn().mockRejectedValue({
      error: 'Error getting user'
    });

    expect(authenticateUser()).rejects.toEqual({ error: 'Error getting user' });
  });
});
