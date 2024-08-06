import { useQuery } from 'react-query';
import {
  useAuthenticateUser,
  useToken,
  useUserRbacPermissions
} from '../utilities/platformServices';

interface User {
  canReadManifests: boolean;
  canWriteManifests: boolean;
  isEntitled: boolean;
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

const useSCACapableStatus = async (): Promise<SCACapableStatusResponse> => {
  const jwtToken = useToken();
  return fetch('/api/rhsm/v2/organization', {
    headers: { Authorization: `Bearer ${await jwtToken}` }
  }).then((response) => response.json());
};

const useUser = () => {
  const authenticateUser = useAuthenticateUser();
  const userRbacPermissions = useUserRbacPermissions();
  const scaCapableStatus = useSCACapableStatus();
  return useQuery('user', async () => {
    const userStatus = await authenticateUser;
    const rawRbacPermissions = await userRbacPermissions;
    const scaStatusResponse = await scaCapableStatus;
    const rbacPermissions = rawRbacPermissions.map((rawPermission) => rawPermission.permission);
    const user: User = {
      canReadManifests:
        rbacPermissions.includes('subscriptions:manifests:read') ||
        rbacPermissions.includes('subscriptions:*:*'),
      canWriteManifests:
        rbacPermissions.includes('subscriptions:manifests:write') ||
        rbacPermissions.includes('subscriptions:*:*'),
      isEntitled: userStatus.entitlements.smart_management?.is_entitled,
      isOrgAdmin: userStatus.identity.user.is_org_admin === true,
      isSCACapable: scaStatusResponse?.body?.simpleContentAccessCapable === true
    };
    return user;
  });
};

export { SCACapableStatusResponse, useUser as default, User };
