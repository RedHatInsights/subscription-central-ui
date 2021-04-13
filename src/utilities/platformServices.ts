import config, { EnvironmentConfig } from '../config';

declare global {
  interface Window {
    insights: any;
  }
}

export interface AuthenticateUserResponse {
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

type Environment = 'development' | 'ci' | 'qa' | 'stage' | 'prod';

export const authenticateUser = (): Promise<AuthenticateUserResponse> => {
  try {
    return window.insights.chrome.auth.getUser();
  } catch (e) {
    throw new Error(`Error authenticating user: ${e.message}`);
  }
};

export const getEnvironment = (): Environment => {
  const env = window.insights.chrome.getEnvironment();
  const isBeta = window.insights.chrome.isBeta();

  if (isBeta === true && (env === 'ci' || env === 'qa')) {
    return 'development';
  }
  return env || 'development';
};

export const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  return config[env];
};
