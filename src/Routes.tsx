import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import React, { lazy, LazyExoticComponent, ReactNode, ComponentType } from 'react';

const SatelliteManifestPage = lazy(
  () => import(/* webpackChunkName: "SatelliteManifestPage" */ './pages/SatelliteManifestPage')
);
const SamplePage = lazy(() => import(/* webpackChunkName: "SamplePage" */ './pages/SamplePage'));
const OopsPage = lazy(() => import(/* webpackChunkName: "OopsPage" */ './pages/OopsPage'));
const NoPermissionsPage = lazy(
  () => import(/* webpackChunkName: "NoPermissionsPage" */ './pages/NoPermissionsPage')
);

interface InsightsRouteParams {
  path: string;
  rootClass: string;
  component: LazyExoticComponent<
    ComponentType<RouteComponentProps<unknown>> | ComponentType<unknown>
  >;
}

const InsightsRoute = ({ component, rootClass, path }: InsightsRouteParams) => {
  const Component = component;
  const root = document.getElementById('root');
  root.removeAttribute('class');
  root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
  root.setAttribute('role', 'main');

  return <Route path={path} component={Component} />;
};

const routes = [
  {
    path: '/satellite-manifest',
    component: SatelliteManifestPage,
    rootClass: 'satelliteManifestPage'
  },
  {
    path: '/sample',
    component: SamplePage,
    rootClass: 'SamplePage'
  },
  {
    path: '/oops',
    component: OopsPage,
    rootClass: 'oopsPage'
  },
  {
    path: '/no-permissions',
    component: NoPermissionsPage,
    rootClass: 'noPermissionsPage'
  }
];

export const Routes: ReactNode = () => {
  return (
    <Switch>
      {routes.map(({ component, rootClass, path }: InsightsRouteParams) => (
        <InsightsRoute key={rootClass} path={path} component={component} rootClass={rootClass} />
      ))}

      {/* Catch all unmatched routes */}
      <Route>
        <Redirect to="/oops" />
      </Route>
    </Switch>
  );
};
