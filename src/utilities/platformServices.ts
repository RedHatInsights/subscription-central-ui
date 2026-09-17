import config, { EnvironmentConfig } from './config/config';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

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

export { useConfig, useEnvironment, useToken };
