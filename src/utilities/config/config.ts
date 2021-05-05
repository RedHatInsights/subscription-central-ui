import defaultConfig from './config.default';
import stageConfig from './config.stage';
import productionConfig from './config.production';

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
    ...defaultConfig
  },
  qa: {
    ...defaultConfig
  },
  stage: {
    ...defaultConfig,
    ...stageConfig
  },
  prod: {
    ...defaultConfig,
    ...productionConfig
  }
};

export default config;
