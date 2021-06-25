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

  const MainContent = () => {
    if (error) {
      return <Unavailable />;
    } else if (isLoading) {
      return <Processing />;
    } else if (data?.length > 0) {
      return <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />;
    } else if (data?.length === 0 && user.isOrgAdmin === true) {
      return <CreateManifestPanel />;
    } else if (data?.length === 0 && user.isOrgAdmin === false) {
      return <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />;
    }
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <MainContent />
      </Main>
    </>
  );
};

export default withRouter(SatelliteManifestPage);
