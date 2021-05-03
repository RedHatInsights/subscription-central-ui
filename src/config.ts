export interface Config {
  ci: EnvironmentConfig;
  qa: EnvironmentConfig;
  stage: EnvironmentConfig;
  prod: EnvironmentConfig;
}

export interface EnvironmentConfig {
  rhsmAPIBase: string;
}

const sharedConfig = {
  rhsmAPIBase: 'https://api.access.qa.redhat.com'
};

const config: Config = {
  ci: {
    ...sharedConfig
  },
  qa: {
    ...sharedConfig
  },
  stage: {
    rhsmAPIBase: 'https://api.access.stage.redhat.com'
  },
  prod: {
    rhsmAPIBase: 'https://api.access.redhat.com'
  }
};

export default config;
