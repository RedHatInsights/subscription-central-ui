import { Navigate, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';
import { Processing } from './components/emptyState';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const SatelliteManifestPage = lazy(() => import('./pages/SatelliteManifestPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));

export const ManifestRoutes = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.hideGlobalFilter(true);
  }, []);

  return (
    <div className="manifests">
      <Suspense fallback={<Processing />}>
        <Routes>
          <Route path="/" element={<SatelliteManifestPage />} />
          <Route path="/oops" element={<OopsPage />} />
          {/* Finally, catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/oops" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};
