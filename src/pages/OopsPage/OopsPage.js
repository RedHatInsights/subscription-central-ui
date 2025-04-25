import React, { useEffect } from 'react';

import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';

const OopsPage = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.appAction('oops-page');
  }, []);
  return (
    <PageSection hasBodyWrapper={false}>
      <Unavailable />
    </PageSection>
  );
};

export default OopsPage;
