import React, { FC } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { Text, TextContent } from '@patternfly/react-core';
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
    'https://access.redhat.com/documentation/en-us/subscription_central/2023/html/' +
    'creating_and_managing_manifests_for_a_connected_satellite_server/index';

  return (
    <>
      <PageHeader>
        <TextContent>
          <Text component="h1" className="pf-c-title">
            Manifests
          </Text>
          <Text component="p">
            Export subscriptions to your on-premise subscription management application.{' '}
            <ExternalLink href={manifestsMoreInfoLink}>
              Learn more about creating and managing manifests for a connected Satellite Server
            </ExternalLink>
          </Text>
        </TextContent>
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
