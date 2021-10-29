import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = (): Promise<any> => {
  const jwtToken = Cookies.get('cs_jwt');
  return fetch('/api/rhsm/v2/manifests/versions', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  }).then((response) => response.json());
};

const useSatelliteVersions = () => {
  return useQuery('satelliteVersions', () => fetchSatelliteVersions());
};

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
