import React, { FC } from 'react';
import { withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { CreateManifestPanel } from '../../components/emptyState';
import { Processing } from '../../components/emptyState';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';

const SatelliteManifestPage: FC = () => {
  const { isLoading, isFetching, error, data } = useSatelliteManifests();

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <>
          {isLoading && !error && <Processing />}

          {!isLoading && !error && data?.length > 0 && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}

          {!isLoading && !error && data?.length === 0 && user.isOrgAdmin === true && (
            <CreateManifestPanel />
          )}

          {!isLoading && !error && data?.length === 0 && user.isOrgAdmin === false && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}

          {error && <Unavailable />}
        </>
      </Main>
    </>
  );
};

export default withRouter(SatelliteManifestPage);
