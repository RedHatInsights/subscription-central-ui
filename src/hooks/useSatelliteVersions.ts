import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

export interface SatelliteVersion {
  description: string;
  value: string;
}

export const fetchSatelliteVersions = (): Promise<any> => {
  const cs_jwt = Cookies.get('cs_jwt');
  return fetch('https://api.access.qa.redhat.com/management/v1/allocations/versions', {
    headers: { Authorization: `Bearer ${cs_jwt}` },
    mode: 'cors'
  })
    .then((response) => response.json())
    .catch((e) => {
      console.error('Error fetching Satellite Versions', e);
    });
};

const useSatelliteVersions = () => {
  return useQuery('satelliteVersions', () => fetchSatelliteVersions());
};

export { useSatelliteVersions as default };
