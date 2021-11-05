import config, { EnvironmentConfig } from './config/config';

declare global {
  interface Window {
    insights: any;
  }
}

interface AuthenticateUserResponse {
  entitlements: {
    [key: string]: any;
  };
  identity: {
    account_number: string;
    internal: {
      org_id: string;
      account_id: string;
    };
    type: string;
    user: {
      email: string;
      first_name: string;
      is_active: boolean;
      is_internal: boolean;
      is_org_admin: boolean;
      last_name: string;
      locale: string;
      username: string;
    };
  };
}

const authenticateUser = (): Promise<AuthenticateUserResponse> => {
  try {
    return window.insights.chrome.auth.getUser();
  } catch (e) {
    throw new Error(`Error authenticating user: ${e.message}`);
  }
};

interface RbacPermission {
  permission: string;
  resourceDefinitions: Record<string, any>[];
}
const getUserRbacPermissions = (): Promise<RbacPermission[]> => {
  try {
    return window.insights.chrome.getUserPermissions('subscriptions');
  } catch (e) {
    throw new Error(`Error getting user permissions: ${e.message}`);
  }
};

type AppEnvironment = 'ci' | 'qa' | 'stage' | 'prod';

const getEnvironment = (): AppEnvironment => {
  return window?.insights?.chrome?.getEnvironment() || 'ci';
};

const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  return config[env];
};

export {
  AuthenticateUserResponse,
  RbacPermission,
  authenticateUser,
  getConfig,
  getEnvironment,
  getUserRbacPermissions
};
