export interface Config {
  ci: EnvironmentConfig;
  qa: EnvironmentConfig;
  stage: EnvironmentConfig;
  prod: EnvironmentConfig;
}

export interface EnvironmentConfig {
  rhsmAPIBase: string;
}

const config: Config = {
  ci: {
    rhsmAPIBase: 'https://api.access.qa.redhat.com'
  },
  qa: {
    rhsmAPIBase: 'https://api.access.qa.redhat.com'
  },
  stage: {
    rhsmAPIBase: 'https://api.access.stage.redhat.com'
  },
  prod: {
    rhsmAPIBase: 'https://api.access.redhat.com'
  }
};

export default config;
