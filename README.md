[![Build Status](https://travis-ci.org/RedHatInsights/frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/frontend-starter-app)

# Subscription Central

An app to handle subscription management on cloud.redhat.com, built using the [Starter App](https://github.com/RedHatInsights/frontend-starter-app) for Red Hat Insights products that includes Patternfly 4 and shared Red Hat cloud service frontend components.

## Getting Started

In the same parent directory as where you place this code base, you should clone:

- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)
- Subscription Central (this repo)

1. Run [insights-proxy](https://github.com/RedHatInsights/insights-proxy) (requires [Docker](https://www.docker.com/) and modifying /etc/hosts). It's recommended to set a PROXY_PATH environment variable in your .bashrc to avoid having to write the full path to where you clone the repo.

```shell
SPANDX_CONFIG="./profiles/local-frontend.js" bash $PROXY_PATH/scripts/run.sh
```

2. `npm install`

3. `npm run start`

4. Open one of the following environments behind the Red Hat VPN and accept the certs:

- https://ci.foo.redhat.com:1337/beta/insights/subscriptions/manifests
- https://qa.foo.redhat.com:1337/beta/insights/subscriptions/manifests
- https://stage.foo.redhat.com:1337/beta/insights/subscriptions/manifests
- https://prod.foo.redhat.com:1337/beta/insights/subscriptions/manifests

For convenience, the script to run the front-end and the proxy has been provided as `npm run start:proxy`, provided that the insights-proxy repo is located in the parent folder, and Docker is running.

Should you need more help, there is a [comprehensive quick start guide in the Storybook Documentation.](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md)

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)

## Deploying

- This repo uses Travis to deploy the webpack build to another Github repo defined in `.travis.yml`
  - That Github repo has the following branches:
    - `ci-beta` (deployed by pushing to `master` or `main` on this repo)
    - `ci-stable` (deployed by pushing to `main-stable` on this repo)
    - `qa-beta` (deployed by pushing to `main` on this repo)
    - `qa-stable` (deployed by pushing to `main-stable` on this repo)
    - `prod-beta` (deployed by pushing to `prod-beta` on this repo)
    - `prod-stable` (deployed by pushing to `prod-stable` on this repo)
- Travis uploads results to RedHatInight's [codecov](https://codecov.io) account. To change the account, modify CODECOV_TOKEN on https://travis-ci.com/.
