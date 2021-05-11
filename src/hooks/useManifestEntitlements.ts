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
    contentAccessMode: string;
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
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}?include=entitlements`, {
    headers: { Authorization: `Bearer ${cs_jwt}` },
    mode: 'cors'
  })
    .then((response) => response.json())
    .catch((e) => {
      console.error('Error fetching Manifest Entitlements data', e);
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
