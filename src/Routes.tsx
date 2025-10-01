import { Navigate, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Processing } from './components/emptyState';
import Authentication from './components/Authentication';

const SatelliteManifestPage = lazy(() => import('./pages/SatelliteManifestPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));

export const ManifestRoutes = () => (
  <div className="manifests">
    <Suspense fallback={<Processing />}>
      <Authentication>
        <Routes>
          <Route path="/" element={<SatelliteManifestPage />} />
          <Route path="/oops" element={<OopsPage />} />
          {/* Finally, catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/oops" replace />} />
        </Routes>
      </Authentication>
    </Suspense>
  </div>
);
