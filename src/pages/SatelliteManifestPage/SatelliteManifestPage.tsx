import React from 'react';
import { withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';

const SatelliteManifestPage = () => {
  const { isLoading, error, data } = useSatelliteManifests();

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Satellite Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <>
          {!error && <SatelliteManifestPanel isLoading={isLoading} data={data} />}
          {error && <Unavailable />}
        </>
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SatelliteManifestPage);
