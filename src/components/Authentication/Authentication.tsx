import React, { FC, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { Processing } from '../emptyState';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import useUserPermissions from '../../hooks/useUserPermissions';

const Authentication: FC = ({ children }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { isLoading, isFetching, isSuccess, isError } = useUserPermissions();

  useEffect(() => {
    /**
     * On every rerender, based on URL change (location.pathname),
     * reset the user's status to loading before authenticating again.
     */
    queryClient.invalidateQueries('userPermissions');
  }, [location.pathname]);

  if (isError === true) {
    return <Unavailable />;
  } else if (isLoading === true || isFetching === true) {
    return <Processing />;
  } else if (isSuccess === true) {
    return <>{children}</>;
  }
};

export default Authentication;
