import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

const getManifestEntitlements = (uuid: string): any => {
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

const useManifestEntitlements = (uuid: string) => {
  return useQuery<any, Error>(['manifestEntitlements', uuid], () => getManifestEntitlements(uuid));
};

export { useManifestEntitlements as default };
