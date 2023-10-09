import React, { useEffect } from 'react';

import Main from '@redhat-cloud-services/frontend-components/Main';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const NoPermissionsPage = () => {
  const chrome = useChrome();
  useEffect(() => {
    chrome.appAction('no-permissions');
  }, []);

  return (
    <Main>
      <NotAuthorized serviceName="Manifests" />
    </Main>
  );
};

export default NoPermissionsPage;
