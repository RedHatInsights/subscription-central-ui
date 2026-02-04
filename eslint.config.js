/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config');
const fecPlugin = require('@redhat-cloud-services/eslint-config-redhat-cloud-services');
const tsParser = require('@typescript-eslint/parser');
const tseslint = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig(
  fecPlugin,
  {
    languageOptions: {
      globals: {
        insights: 'readonly'
      }
    },
    ignores: ['node_modules/*', 'dist/*'],
    rules: {
      'react/prop-types': 'off',
      requireConfigFile: 'off',
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true
        }
      ]
    }
  },
  tseslint.configs['flat/recommended'],
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
);
