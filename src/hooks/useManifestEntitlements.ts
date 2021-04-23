import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';

interface ManifestEntitlement {
  id: string;
  sku: string;
  contractNumber: string;
  entitlementQuantity: number;
  startDate?: string;
  endDate?: string;
  subscriptionName?: string;
}

interface ManifestEntitlements {
  body: {
    contentAccessMode: string;
    createdBy: string;
    createdDate: string;
    entitlementsAttached: {
      valid: boolean;
      reason?: string;
      value?: ManifestEntitlement[];
    };
  };
}

const getManifestEntitlements = (uuid: string): Promise<ManifestEntitlements> => {
  const cs_jwt = Cookies.get('cs_jwt');
  return fetch(
    `https://api.access.qa.redhat.com/management/v1/allocations/${uuid}?include=entitlements`,
    {
      headers: { Authorization: `Bearer ${cs_jwt}` },
      mode: 'cors'
    }
  )
    .then((response) => response.json())
    .catch((e) => {
      console.error('Error fetching Manifest Entitlements data', e);
    });
};

const useManifestEntitlements = (
  uuid: string
): QueryObserverResult<ManifestEntitlements, unknown> => {
  return useQuery<any, Error>(['manifestEntitlements', uuid], () => getManifestEntitlements(uuid));
};

export { ManifestEntitlements, ManifestEntitlement, useManifestEntitlements as default };
