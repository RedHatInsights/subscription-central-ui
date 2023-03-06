import { Navigate, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy, ReactNode } from 'react';
import { Processing } from './components/emptyState';
import Authentication from './components/Authentication';

const SatelliteManifestPage = lazy(() => import('./pages/SatelliteManifestPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));
const NoPermissionsPage = lazy(() => import('./pages/NoPermissionsPage'));

export const ManifestRoutes: ReactNode = () => (
  <div className="manifests">
    <Suspense fallback={<Processing />}>
      <Authentication>
        <Routes>
          <Route path="/" element={<SatelliteManifestPage />} />
          <Route path="/oops" element={<OopsPage />} />
          <Route path="/no-permissions" element={<NoPermissionsPage />} />
          {/* Finally, catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/oops" replace />} />
        </Routes>
      </Authentication>
    </Suspense>
  </div>
);
