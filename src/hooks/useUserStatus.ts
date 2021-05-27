import { useQuery, UseQueryResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig, authenticateUser } from '../utilities/platformServices';

interface User {
  isOrgAdmin: boolean;
  isSCACapable: boolean;
}

interface SCACapableStatusResponse {
  id: string;
  simpleContentAccessCapable: boolean;
  simpleContentAccess: 'enabled' | 'disabled';
}

const fetchSCACapableStatus = (): Promise<SCACapableStatusResponse> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/org`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
  })
    .then((response) => response.json())
    .catch((e) => {
      console.error('Error fetching Satellite Versions', e);
    });
};

const getUser = (): Promise<User | void> => {
  return Promise.all([authenticateUser()])
    .then(([userStatus]) => {
      const formattedUserStatus: User = {
        isOrgAdmin: userStatus.identity.user.is_org_admin,
        isSCACapable: true
      };
      return formattedUserStatus;
    })
    .catch((e) => {
      console.error('Error fetching User status', e);
    });
};

const useUserStatus = (): UseQueryResult<User, unknown> => {
  return useQuery('userStatus', () => getUser());
};

export { fetchSCACapableStatus, getUser, useUserStatus as default, User };
