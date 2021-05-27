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
import useUserStatus from '../../hooks/useUserStatus';

const SatelliteManifestPage: FC = () => {
  const { isLoading, isFetching, error, data } = useSatelliteManifests();
  // This pulls user in from cache.
  const { data: user } = useUserStatus();

  const MainContent = () => {
    if (error) {
      return <Unavailable />;
    } else if (isLoading) {
      return <Processing />;
    } else if (data?.length > 0) {
      return <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />;
    } else if (data?.length === 0 && user.isOrgAdmin === true) {
      return <CreateManifestPanel />;
    } else if (data?.length === 0 && user?.isOrgAdmin === false) {
      return <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />;
    } else {
      return <Unavailable />;
    }
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Satellite Manifests" />
        <p>Export subscriptions to your on-premise subscription management application</p>
      </PageHeader>
      <Main>
        <MainContent />
      </Main>
    </>
  );
};

export default withRouter(SatelliteManifestPage);
