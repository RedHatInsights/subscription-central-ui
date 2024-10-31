import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

const toHaveLoader = (obj) => {
  if (obj.queryByRole('progressbar')) {
    return {
      message: () => 'Must have loader with role "progressbar"',
      pass: true
    };
  } else {
    return {
      message: () => 'Must have loader with role "progressbar"',
      pass: false
    };
  }
};

let mocki = 0;

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    hideGlobalFilter: jest.fn(),
    updateDocumentTitle: jest.fn(),
    auth: {
      getToken: () => Promise.resolve('TOKEN'),
      getUser: () =>
        Promise.resolve({
          identity: {
            account_number: '0',
            type: 'User',
            user: {
              is_org_admin: true,
              email: 'john.doe@redhat.com'
            }
          },
          entitlements: {
            hybrid_cloud: { is_entitled: true },
            insights: { is_entitled: true },
            openshift: { is_entitled: true },
            smart_management: { is_entitled: false }
          }
        })
    },
    appAction: jest.fn(),
    appObjectId: jest.fn(),
    on: jest.fn(),
    getUserPermissions: () =>
      Promise.resolve([
        { resourceDefinitions: [], permission: 'subscriptions:manifests:read' },
        { resourceDefinitions: [], permission: 'subscriptions:manifests:write' }
      ]),
    getEnvironment: () => {
      if (!mocki) {
        mocki++;
        return 'qa';
      }
      return null;
    }
  })
}));

expect.extend({
  toHaveLoader
});
