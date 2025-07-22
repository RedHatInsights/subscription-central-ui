import React, { FC, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { Processing } from '../emptyState';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import useUser from '../../hooks/useUser';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const Authentication: FC = ({ children }) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const chrome = useChrome();

  const { isLoading, isFetching, isSuccess, isError } = useUser();

  useEffect(() => {
    /**
     * On every rerender, based on URL change (location.pathname),
     * reset the user's status to loading before authenticating again.
     */
    queryClient.invalidateQueries('user');
  }, [location.pathname]);

  useEffect(() => {
    if (isSuccess) chrome.hideGlobalFilter(true);
  }, [isSuccess]);

  if (isError) {
    return <Unavailable />;
  } else if (isLoading || isFetching) {
    return <Processing />;
  } else if (isSuccess) {
    return <>{children}</>;
  }
};

export default Authentication;
