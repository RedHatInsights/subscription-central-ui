import { useEnvironment } from '../platformServices';

jest.mock('@redhat-cloud-services/frontend-components/useChrome');

describe('getEnvironment', () => {
  it('returns the environment', () => {
    expect(useEnvironment()).toEqual('qa');
  });

  it('defaults to returning "ci"', () => {
    expect(useEnvironment()).toEqual('ci');
  });
});
