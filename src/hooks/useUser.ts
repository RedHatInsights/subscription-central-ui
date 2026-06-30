import { useQuery } from '@tanstack/react-query';
import { useAuthenticateUser, useToken } from '../utilities/platformServices';
import { HttpError } from '../utilities/errors';

interface User {
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
  const response = await fetch('/api/rhsm/v2/organization', {
    headers: { Authorization: `Bearer ${await jwtToken}` }
  });

  return await response.json();
};

const useUser = () => {
  const authenticateUser = useAuthenticateUser();
  const scaCapableStatus = useSCACapableStatus();
  return useQuery<User, HttpError>({
    queryKey: ['user'],
    queryFn: async () => {
      const userStatus = await authenticateUser;
      const scaStatusResponse = await scaCapableStatus;
      const user: User = {
        isOrgAdmin: userStatus.identity.user?.is_org_admin === true,
        isSCACapable: scaStatusResponse?.body?.simpleContentAccessCapable === true
      };
      return user;
    },
    retry: false
  });
};

export { SCACapableStatusResponse, useUser as default, User };
