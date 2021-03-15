import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, ReactNode } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SatelliteManifestPage = lazy(() => import('./pages/SatelliteManifestPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));
const NoPermissionsPage = lazy(() => import('./pages/NoPermissionsPage'));

export const Routes: ReactNode = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Switch>
      <Route path="/satellite-manifest" component={SatelliteManifestPage} />
      <Route path="/oops" component={OopsPage} />
      <Route path="/no-permissions" component={NoPermissionsPage} />
      {/* Finally, catch all unmatched routes */}
      <Route>
        <Redirect to="/oops" />
      </Route>
    </Switch>
  </Suspense>
);
