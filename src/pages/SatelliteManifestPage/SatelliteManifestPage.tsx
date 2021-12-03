import React, { FC } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { Processing } from '../../components/emptyState';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import ExternalLink from '../../components/ExternalLink';

const SatelliteManifestPage: FC = () => {
  const { isLoading, isFetching, error, data } = useSatelliteManifests();

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const manifestsMoreInfoLink =
    'https://access.redhat.com/documentation/en-us/subscription_central/2021/html/' +
    'creating_and_managing_manifests_for_a_connected_satellite_server/index';

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Manifests" />
        <p>
          Export subscriptions to your on-premise subscription management application.{' '}
          <ExternalLink href={manifestsMoreInfoLink}>
            Learn more about creating and managing manifests for a connected Satellite Server
          </ExternalLink>
        </p>
      </PageHeader>
      <Main>
        <>
          {isLoading && !error && <Processing />}

          {!isLoading && !error && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}

          {error && <Unavailable />}
        </>
      </Main>
    </>
  );
};

export default SatelliteManifestPage;
