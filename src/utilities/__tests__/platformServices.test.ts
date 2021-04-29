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

describe('Get config method', () => {
  it('gets the QA API base when the environment is ci', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockImplementation(() => 'ci');

    const { rhsmAPIBase } = getConfig();

    expect(rhsmAPIBase).toEqual('https://api.access.qa.redhat.com');
  });

  it('gets the QA API base when the environment is qa', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockImplementation(() => 'qa');

    const { rhsmAPIBase } = getConfig();

    expect(rhsmAPIBase).toEqual('https://api.access.qa.redhat.com');
  });

  it('gets the Stage API base when the environment is stage', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockImplementation(() => 'stage');

    const { rhsmAPIBase } = getConfig();

    expect(rhsmAPIBase).toEqual('https://api.access.stage.redhat.com');
  });

  it('gets the Prod API base when the environment is stage', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockImplementation(() => 'prod');

    const { rhsmAPIBase } = getConfig();

    expect(rhsmAPIBase).toEqual('https://api.access.redhat.com');
  });

  it('defaults to the QA API base when the environment is not defined', () => {
    window.insights.chrome.getEnvironment = jest.fn().mockImplementation(() => null);

    const { rhsmAPIBase } = getConfig();

    expect(rhsmAPIBase).toEqual('https://api.access.qa.redhat.com');
  });
});
