import { useQuery } from 'react-query';

export interface Entry {
  entitlementQuantity: number;
  name: string;
  type: string;
  url: string;
  uuid: string;
  version: string;
}

interface Cookies {
  [name: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useSatelliteManifests = (cookies: Cookies) => {
  return useQuery('manifests', () => {
    return fetch('https://api.access.qa.redhat.com/management/v1/allocations', {
      headers: { Authorization: `Bearer ${cookies.cs_jwt}` },
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.body.filter((manifest: Entry) => manifest.type === 'Satellite');
        return filteredData;
      });
  });
};

export { useSatelliteManifests as default };
