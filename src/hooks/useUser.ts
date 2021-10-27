import { useQuery, UseQueryResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig, authenticateUser, getUserRbacPermissions } from '../utilities/platformServices';

interface User {
  canReadManifests: boolean;
  canWriteManifests: boolean;
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

const getUser = (): Promise<User> => {
  return Promise.all([authenticateUser(), fetchSCACapableStatus(), getUserRbacPermissions()]).then(
    ([userStatus, scaStatusResponse, rawRbacPermissions]) => {
      const rbacPermissions = rawRbacPermissions.map((rawPermission) => rawPermission.permission);
      const user: User = {
        canReadManifests:
          rbacPermissions.includes('subscriptions:manifests:read') ||
          rbacPermissions.includes('subscriptions:*:*'),
        canWriteManifests:
          rbacPermissions.includes('subscriptions:manifests:write') ||
          rbacPermissions.includes('subscriptions:*:*'),
        isOrgAdmin: userStatus.identity.user.is_org_admin === true,
        isSCACapable: scaStatusResponse.body.simpleContentAccessCapable === true
      };
      return user;
    }
  );
};

const useUser = (): UseQueryResult<User, unknown> => {
  return useQuery('user', () => getUser());
};

export { fetchSCACapableStatus, getUser, SCACapableStatusResponse, useUser as default, User };
