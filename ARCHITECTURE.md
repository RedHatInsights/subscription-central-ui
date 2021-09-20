# Architecture

This repo's source code builds a static React app to be served on https://console.redhat.com.

The React app bundled using [Webpack](https://webpack.js.org) includes:

- [@patternfly/react-core](https://github.com/patternfly/patternfly-react) as the component library
- A [react-router-dom BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter) for routing pages
  - Uses the HTML5 history API (pushState, replaceState and the popstate event) to keep UI in sync with the URL
- [React-query](https://react-query.tanstack.com/), through custom data-fetching hooks in the src/hooks folder, for managing API state
- [React.lazy and React.Suspense](https://reactjs.org/docs/code-splitting.html#reactlazy) for asynchronously loading components
- [React.useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) for managing notification state (in src/contexts/NotificationProvider.tsx)

## Micro frontends

These assets are loaded via [Insights chrome](https://github.com/RedHatInsights/insights-chrome) which provides user auth, top and side nav (aka chroming), and a `<main id="root">` to inject into, using a [micro frontends approach](https://martinfowler.com/articles/micro-frontends.html). Diagram here:

![Console dot architecture diagram](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/img/chrome.png?raw=true)

More information on the overall setup can be found on the Storybook for console.redhat.com [here](https://console.redhat.com/docs/storybook?path=/story/welcome--getting-started).

## Webpack

This repo uses a [shared common config](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-config) with sensible defaults to build and run your application.

This repo uses [federated modules](https://webpack.js.org/concepts/module-federation/) to seamlessly load multiple applications at runtime.

## Code Quality Tools

To maintain code quality, the following tools are used:

- [Typescript](https://www.typescriptlang.org/), to add type checking
- [Eslint](https://eslint.org/), to enforce consistent code formatting
- [Prettier](https://prettier.io/docs/en/install.html), an opinionated code formatter for automatic code formatting on save
  - To set this up in VS Code:
    - Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    - In settings (command + comma or control + comma), search for "format on save" and make sure that is checked
    - Still in settings, search for Prettier and make sure that the "Require Config" is checked.
    - Then open a file and intentionally make spacing off and hit save, to confirm that prettier is auto-formatting properly.
- [Jest](https://jestjs.io/), for unit tests. Note that the repo is configured so that at least 85% code coverage is required for the entire app or the test suite will fail.
- [@testing-library/react](https://testing-library.com/docs/) for additional testing functionality
- [Sentry](https://docs.sentry.io/platforms/javascript/) for error tracking in production
