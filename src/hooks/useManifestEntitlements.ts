<<<<<<< konflux/mintmaker/main/redhat-cloud-services-eslint-config-redhat-cloud-services-3.x
import { QueryObserverResult, useQuery } from '@tanstack/react-query';
=======
import { useQuery } from '@tanstack/react-query';
>>>>>>> main
import { useToken } from '../utilities/platformServices';

interface ManifestEntitlement {
  id: string;
  sku: string;
  contractNumber: string;
  entitlementQuantity: number;
  startDate?: string;
  endDate?: string;
  subscriptionName?: string;
}

interface ManifestEntitlementsData {
  body: {
    simpleContentAccess: string;
    createdBy: string;
    createdDate: string;
    entitlementsAttached: EntitlementsAttachedData;
    entitlementsAttachedQuantity: number;
    lastModified: string;
    name: string;
    type: string;
    uuid: string;
    version: string;
  };
}

interface EntitlementsAttachedData {
  valid: boolean;
  reason?: string;
  value?: ManifestEntitlement[];
}

const getManifestEntitlements =
  (jwtToken: Promise<string>) =>
  async (uuid: string): Promise<ManifestEntitlementsData> => {
    return fetch(`/api/rhsm/v2/manifests/${uuid}?include=entitlements`, {
      headers: { Authorization: `Bearer ${await jwtToken}` }
    }).then((response) => {
      if (response.status != 200) {
        throw new Error(`Failed to fetch manifest entitlements: ${response.statusText}`);
      }
      return response.json();
    });
  };

const useManifestEntitlements = (uuid: string) => {
  const jwtToken = useToken();
  return useQuery<ManifestEntitlementsData, Error>({
    queryKey: ['manifestEntitlements', uuid],
    queryFn: () => getManifestEntitlements(jwtToken)(uuid)
  });
};

export {
  EntitlementsAttachedData,
  ManifestEntitlementsData,
  ManifestEntitlement,
  useManifestEntitlements as default,
  getManifestEntitlements
};
