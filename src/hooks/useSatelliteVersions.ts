import { useQuery } from 'react-query';
import { useToken } from '../utilities/platformServices';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = (jwtToken: Promise<string>) => async (): Promise<any> => {
  return fetch('/api/rhsm/v2/manifests/versions', {
    headers: { Authorization: `Bearer ${await jwtToken}` }
  }).then((response) => {
    if (response.status != 200) {
      throw new Error(`Failed to fetch satellite versions: ${response.statusText}`);
    }
    return response.json();
  });
};

const useSatelliteVersions = () => {
  const jwtToken = useToken();
  return useQuery('satelliteVersions', () => fetchSatelliteVersions(jwtToken)());
};

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
