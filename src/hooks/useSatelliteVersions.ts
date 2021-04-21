import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = (): Promise<any> => {
  const jwtToken = Cookies.get('cs_jwt');
  return fetch('https://api.access.qa.redhat.com/management/v1/allocations/versions', {
    headers: { Authorization: `Bearer ${jwtToken}` },
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

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
