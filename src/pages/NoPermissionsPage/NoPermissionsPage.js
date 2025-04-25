import React, { useEffect } from 'react';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';

const NoPermissionsPage = () => {
  const chrome = useChrome();
  useEffect(() => {
    chrome.appAction('no-permissions');
  }, []);

  return (
    <PageSection hasBodyWrapper={false}>
      <NotAuthorized serviceName="Manifests" />
    </PageSection>
  );
};

export default NoPermissionsPage;
