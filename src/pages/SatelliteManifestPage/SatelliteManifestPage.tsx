import React from 'react';
import { withRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';

const SatelliteManifestPage = () => {
  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Satellite Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <CookiesProvider>
          <SatelliteManifestPanel />
        </CookiesProvider>
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SatelliteManifestPage);
