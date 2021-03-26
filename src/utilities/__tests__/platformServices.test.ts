import { authenticateUser } from '../platformServices';

describe('Authenticate User method', () => {
  it('should return a promise with user data', () => {
    window.insights = {
      chrome: {
        auth: {
          getUser: jest.fn().mockImplementation(
            () =>
              new Promise((resolve) => {
                process.nextTick(() => {
                  resolve({
                    identity: {
                      user: {
                        email: 'john.doe@redhat.com'
                      }
                    }
                  });
                });
              })
          )
        }
      }
    };

    expect(authenticateUser()).resolves.toEqual({
      identity: {
        user: {
          email: 'john.doe@redhat.com'
        }
      }
    });
  });

  it('should throw an error if rejected', () => {
    window.insights = {
      chrome: {
        getUser: jest.fn().mockImplementation(
          () =>
            new Promise((resolve, reject) => {
              process.nextTick(() => {
                reject({
                  error: 'Error getting user'
                });
              });
            })
        )
      }
    };

    expect(() => authenticateUser()).toThrow(Error);
  });
});
