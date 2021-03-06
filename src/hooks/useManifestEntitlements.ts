import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

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

const getManifestEntitlements = (uuid: string): Promise<ManifestEntitlementsData> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}?include=entitlements`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
  }).then((response) => response.json());
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
