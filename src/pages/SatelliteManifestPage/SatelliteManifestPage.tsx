import React, { FC } from 'react';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { Processing } from '../../components/emptyState';
import useUser from '../../hooks/useUser';
import ExternalLink from '../../components/ExternalLink';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import NoPermissionsPage from '../NoPermissionsPage';

const SatelliteManifestPage: FC = () => {
  const { isLoading, isFetching, error, data } = useSatelliteManifests();

  const { data: user, isError: userError } = useUser();
  const manifestsMoreInfoLink =
    'https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/' +
    'creating_and_managing_manifests_for_a_connected_satellite_server/index';

  if (!user?.canReadManifests) {
    return <NoPermissionsPage />;
  }

  const hasError = error || userError;

  return (
    <>
      <PageHeader>
        <Content>
          <Content component="h1">Manifests</Content>
          <Content component="p">
            Create and export manifests for your on-premise subscription management application.
            This page does not allow you to add subscriptions to manifests. Subscriptions can be
            added to the manifest using the Satellite Server web user interface after importing the
            downloaded manifests.{' '}
            <ExternalLink href={manifestsMoreInfoLink}>
              Learn more about creating and managing manifests for a connected Satellite Server
            </ExternalLink>
          </Content>
        </Content>
      </PageHeader>
      <PageSection hasBodyWrapper={false}>
        <>
          {hasError && <Unavailable />}

          {isLoading && !hasError && <Processing />}

          {!isLoading && !hasError && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}
        </>
      </PageSection>
    </>
  );
};

export default SatelliteManifestPage;
