import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authenticateUser } from '../../utilities/platformServices';
import { Processing } from '../EmptyState';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';

const PermissionsCheck: FC = ({ children }) => {
  const [orgAdminStatus, setOrgAdminStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    authenticateUser()
      .then((response) => {
        if (response.identity.user.is_org_admin === true) {
          setOrgAdminStatus('true');
        } else {
          setOrgAdminStatus('false');
        }
      })
      .catch(() => {
        setOrgAdminStatus('error');
      });
  }, [location]);

  return (
    <>
      {orgAdminStatus === 'checking' && <Processing />}

      {orgAdminStatus === 'false' && <NotAuthorized serviceName="Manifests" />}

      {orgAdminStatus === 'true' && children}

      {orgAdminStatus === 'error' && <Unavailable />}
    </>
  );
};

export default PermissionsCheck;
