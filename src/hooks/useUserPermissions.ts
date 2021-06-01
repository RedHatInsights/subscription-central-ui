import { useQuery, UseQueryResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig, authenticateUser } from '../utilities/platformServices';

interface UserPermissions {
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
      console.error('Error fetching SCA Capable Status', e);
    });
};

const getUserPermissions = (): Promise<UserPermissions | void> => {
  return Promise.all([authenticateUser()]).then(([userStatus]) => {
    const userPermissions: UserPermissions = {
      isOrgAdmin: userStatus.identity.user.is_org_admin,
      isSCACapable: true
    };
    return userPermissions;
  });
};

const useUserPermissions = (): UseQueryResult<UserPermissions, unknown> => {
  return useQuery('userPermissions', () => getUserPermissions());
};

export {
  fetchSCACapableStatus,
  getUserPermissions,
  useUserPermissions as default,
  UserPermissions
};
