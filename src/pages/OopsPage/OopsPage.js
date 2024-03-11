import React, { useEffect } from 'react';

import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { PageSection } from '@patternfly/react-core';

const OopsPage = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.appAction('oops-page');
  }, []);
  return (
    <PageSection>
      <Unavailable />
    </PageSection>
  );
};

export default OopsPage;
