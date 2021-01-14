import React from 'react';
import { withRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { Main } from '@redhat-cloud-services/frontend-components/components/esm/Main';
import { PageHeader } from '@redhat-cloud-services/frontend-components/components/esm/PageHeader';
// eslint-disable-next-line max-len
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/esm/PageHeader';
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
