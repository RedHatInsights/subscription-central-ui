/* eslint-disable @typescript-eslint/no-explicit-any -- outside of update scope, fix later*/
import config, { EnvironmentConfig } from './config/config';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

interface AuthenticateUserResponse {
  entitlements: {
    [key: string]: any;
  };
  identity: {
    account_number?: string;
    internal?: {
      org_id: string;
      account_id: string;
    };
    type: string;
    user?: {
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

const useAuthenticateUser = async (): Promise<AuthenticateUserResponse> => {
  const chrome = useChrome();

  try {
    const user = await chrome.auth.getUser();

    if (!user) {
      throw new Error('unable to authenticate');
    }

    return {
      entitlements: user.entitlements,
      identity: user.identity
    };
  } catch (e) {
    throw new Error(`Error authenticating user: ${e.message}`);
  }
};

interface RbacPermission {
  permission: string;
  resourceDefinitions: Record<string, any>[];
}
const useUserRbacPermissions = (): Promise<RbacPermission[]> => {
  const chrome = useChrome();
  return chrome.getUserPermissions('subscriptions');
};

type AppEnvironment = 'ci' | 'qa' | 'stage' | 'prod';

const useEnvironment = (): AppEnvironment => {
  const chrome = useChrome();
  return (chrome.getEnvironment() as AppEnvironment) || 'ci';
};

const useConfig = (): EnvironmentConfig => {
  const env = useEnvironment();
  return config[env];
};

const useToken = () => {
  const chrome = useChrome();
  return chrome.auth.getToken();
};

export {
  AuthenticateUserResponse,
  RbacPermission,
  useAuthenticateUser,
  useConfig,
  useEnvironment,
  useUserRbacPermissions,
  useToken
};
