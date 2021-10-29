import { authenticateUser } from '../platformServices';

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
