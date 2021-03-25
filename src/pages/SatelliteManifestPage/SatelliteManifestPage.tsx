import React, { FC } from 'react';
import { withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { NoSatelliteManifests } from '../../components/EmptyState';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SatelliteManifestPage: FC = () => {
  const { isLoading, error, data } = useSatelliteManifests();

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Satellite Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <>
          {isLoading && (
            <Bullseye>
              <Spinner />
            </Bullseye>
          )}
          {!isLoading && data.length > 0 && (
            <SatelliteManifestPanel isLoading={isLoading} data={data} />
          )}
          {!isLoading && data.length === 0 && <NoSatelliteManifests />}
          {error && <Unavailable />}
        </>
      </Main>
    </>
  );
};

export default withRouter(SatelliteManifestPage);
