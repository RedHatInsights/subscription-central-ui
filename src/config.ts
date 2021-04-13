export interface Config {
  development: EnvironmentConfig;
  ci: EnvironmentConfig;
  qa: EnvironmentConfig;
  stage: EnvironmentConfig;
  prod: EnvironmentConfig;
}

export interface EnvironmentConfig {
  rhsmAPIBase: string;
}

const config: Config = {
  development: {
    /**
     * Note: when developing locally, /api proxies to
     * https://api.access.qa.redhat.com/management via
     * the config/dev.webpack.config.js settings, to avoid CORS issues.
     */
    rhsmAPIBase: '/beta/rhsm-api'
  },
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
