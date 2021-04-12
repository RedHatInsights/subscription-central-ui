import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authenticateUser } from '../../utilities/platformServices';
import UserContext, { UserContextValue } from './UserContext';
import { Processing } from '../emptyState';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';

const Authentication: FC = ({ children }) => {
  const [user, setUser] = useState({ status: 'loading', isOrgAdmin: null });
  const value = { user, setUser };
  const location = useLocation();

  useEffect(() => {
    /**
     * On every rerender, based on URL change (location.pathname),
     * reset the user's status to loading before authenticating again.
     */

    setUser({ status: 'loading', isOrgAdmin: null });

    authenticateUser()
      .then((response) => {
        setUser({ status: 'loaded', isOrgAdmin: response.identity.user.is_org_admin });
      })
      .catch(() => {
        setUser({ status: 'error', isOrgAdmin: null });
      });
  }, [location.pathname]);

  return (
    <UserContext.Provider value={value as UserContextValue}>
      {user.status === 'loading' && <Processing />}

      {user.status === 'loaded' && children}

      {user.status === 'error' && <Unavailable />}
    </UserContext.Provider>
  );
};

export default Authentication;
