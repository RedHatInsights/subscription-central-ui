# Navigation

The placement for this app within the side navigation is established in the [cloud-services-config](https://github.com/redhatinsights/cloud-services-config) repo. This document provides more detail on the general guidance for navigation configuration provided in the [cloud-services config readme](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/README.md).

## Making changes to nav configuration

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

## Promoting navigation updates through environments

You will need to create a separate PR in cloud-services-config for each branch corresponding to the environment you want to add this to.

The manifest-specific lines above will need to be added in a new PR to each branch. It should be added to ci-stable (which should make changes visible automatically, to https://console.stage.redhat.com/), and then prod-stable, at which point the app's menu links will be live.

When making the navigation changes live for the first time in each environment, you will need to separately push the manifests repo through these branches (ci-stable and prod-stable) to do the same. It is advised to push this app to the appropriate branch prior to making it live on the nav side.

These requirements may change over time. If you start a PR in the cloud-services-config repo, the console dot team will be able to assist you to ensure that the app is loading properly in each environment.
