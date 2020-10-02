import React from 'react';
import { withRouter } from 'react-router-dom';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';

const SatelliteManifestPage = () => {
  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Satellite Manifests"/>
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <SatelliteManifestPanel />
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SatelliteManifestPage);
