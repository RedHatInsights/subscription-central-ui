import React, { FC, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { CreateManifestPanel } from '../../components/emptyState';
import { Processing } from '../../components/emptyState';
import UserContext from '../../components/Authentication/UserContext';

const SatelliteManifestPage: FC = () => {
  const { isLoading, isFetching, error, data } = useSatelliteManifests();
  const { user } = useContext(UserContext);

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Satellite Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <>
          {isLoading && <Processing />}

          {!isLoading && data?.length > 0 && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}

          {!isLoading && data?.length === 0 && user.isOrgAdmin === true && <CreateManifestPanel />}

          {!isLoading && data?.length === 0 && user.isOrgAdmin === false && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}

          {error && <Unavailable />}
        </>
      </Main>
    </>
  );
};

export default withRouter(SatelliteManifestPage);
