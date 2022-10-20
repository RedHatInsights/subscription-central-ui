import { useQuery, QueryObserverResult } from 'react-query';

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

const getManifestEntitlements = async (uuid: string): Promise<ManifestEntitlementsData> => {
  const jwtToken = await window.insights.chrome.auth.getToken();
  return fetch(`/api/rhsm/v2/manifests/${uuid}?include=entitlements`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
  }).then((response) => {
    if (response.status != 200) {
      throw new Error(`Failed to fetch manifest entitlements: ${response.statusText}`);
    }
    return response.json();
  });
};

const useManifestEntitlements = (
  uuid: string
): QueryObserverResult<ManifestEntitlementsData, unknown> => {
  return useQuery<any, Error>(['manifestEntitlements', uuid], () => getManifestEntitlements(uuid));
};

export {
  EntitlementsAttachedData,
  ManifestEntitlementsData,
  ManifestEntitlement,
  useManifestEntitlements as default
};
