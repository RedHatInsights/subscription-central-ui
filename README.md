[![Build Status](https://travis-ci.org/RedHatInsights/frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/frontend-starter-app)

# Subscription Central

An app to handle subscription management on console.redhat.com, built using the [Starter App](https://github.com/RedHatInsights/frontend-starter-app) for Red Hat Insights products that includes Patternfly 4 and shared Red Hat cloud service frontend components.

## Getting Started

1. The first time you clone the repo, run `npm install`

2. `npm run start` or `npm run start:beta`, depending on whether you want to run in stable or beta mode.

3. Set up the rhsm-web API proxy so that API calls will be allowed. See this doc here for details depending on which browser you use: https://source.redhat.com/groups/public/customer-platform-devops/digital_experience_operations_dxp_ops_wiki/using_squid_proxy_to_access_akamai_preprod_domains_over_vpn (note that if this is not done, the app will load but all API calls will fail when running locally)

4. Ensure that you are on the Red Hat VPN

5. Open one of the following environments behind the Red Hat VPN and accept the certs:

- https://ci.foo.redhat.com:1337/beta/insights/subscriptions/manifests
- https://qa.foo.redhat.com:1337/beta/insights/subscriptions/manifests
- https://stage.foo.redhat.com:1337/beta/insights/subscriptions/manifests
- https://prod.foo.redhat.com:1337/beta/insights/subscriptions/manifests

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

## Updating the Side Nav

The placement for this app within the side navigation is established in the [cloud-services-config](https://github.com/redhatinsights/cloud-services-config) repo.

### Making changes to nav configuration

Manifests has an unusual navigation placement, in that it is a sub-app of a sub-app, under subscriptions. Here is the current configuration setup to allow this to show up in the proper place:

In the [main.yml](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/main.yml):

```
manifests:
  title: Manifests
  channel: '#subscription-central'
  deployment_repo: https://github.com/RedHatInsights/subscription-central-ui-build
  frontend:
    module:
      appName: manifests
      scope: manifests
      module: ./RootApp
    paths:
      - /insights/subscriptions/manifests
    reload: subscriptions/manifests
  source_repo: https://github.com/RedHatInsights/subscription-central-ui
```

And under the [subscriptions config](https://github.com/RedHatInsights/cloud-services-config/blob/7b9b55b264521b35f96113812fc98455e56b12a4/main.yml#L1030) there is this line:

```
      - id: manifests
```

In the [federated modules config](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/chrome/fed-modules.json), there is this section:

```
"manifests": {
        "manifestLocation": "/apps/manifests/fed-mods.json",
        "modules": [
            {
                "id": "manifests",
                "module": "./RootApp",
                "routes": [
                    "/insights/subscriptions/manifests"
                ]
            }
        ]
    },
```

Also in the [rhel-navigation file](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/chrome/rhel-navigation.json) there is [this section](https://github.com/RedHatInsights/cloud-services-config/blob/7b9b55b264521b35f96113812fc98455e56b12a4/chrome/rhel-navigation.json#L215):

```
                        {
                            "appId": "manifests",
                            "title": "Manifests",
                            "href": "/insights/subscriptions/manifests",
                            "product": "Subscription Watch"
                        },

```

### Promoting nav updates through environments

You will need to create a separate PR in cloud-services-config for each branch corresponding to the environment you want to add this to.

The manifest-specific lines above will need to be added in a new PR to each branch. It should be added to ci-stable (which should make changes visible automatically, to https://console.stage.redhat.com/), and then prod-stable, at which point the app's menu links will be live.

When making the navigation changes live for the first time in each environment, you will need to separately push the manifests repo through these branches (ci-stable and prod-stable) to do the same. It is advised to push this app to the appropriate branch prior to making it live on the nav side.

These requirements may change over time. If you start a PR in the cloud-services-config repo, the console dot team will be able to assist you to ensure that the app is loading properly in each environment.

## App Architecture

Please see the [architecture doc](./ARCHITECTURE.md) for details on the app architecture and tools used.
