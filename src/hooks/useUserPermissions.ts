import { useQuery, UseQueryResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig, authenticateUser } from '../utilities/platformServices';

interface UserPermissions {
  isOrgAdmin: boolean;
  isSCACapable: boolean;
}

interface SCACapableStatusResponse {
  body: {
    id: string;
    simpleContentAccess: 'enabled' | 'disabled';
    simpleContentAccessCapable: boolean;
  };
}

const fetchSCACapableStatus = (): Promise<SCACapableStatusResponse> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/organization`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
  }).then((response) => response.json());
};

const getUserPermissions = (): Promise<UserPermissions> => {
  return Promise.all([authenticateUser(), fetchSCACapableStatus()]).then(
    ([userStatus, scaStatusResponse]) => {
      const userPermissions: UserPermissions = {
        isOrgAdmin: userStatus.identity.user.is_org_admin === true,
        isSCACapable: scaStatusResponse.body.simpleContentAccessCapable === true
      };
      return userPermissions;
    }
  );
};

const useUserPermissions = (): UseQueryResult<UserPermissions, unknown> => {
  return useQuery('userPermissions', () => getUserPermissions());
};

export {
  fetchSCACapableStatus,
  getUserPermissions,
  SCACapableStatusResponse,
  useUserPermissions as default,
  UserPermissions
};
