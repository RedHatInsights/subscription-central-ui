import { useQuery } from 'react-query';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = async (): Promise<any> => {
  const jwtToken = await window.insights.chrome.auth.getToken();
  return fetch('/api/rhsm/v2/manifests/versions', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  }).then((response) => response.json());
};

const useSatelliteVersions = () => {
  return useQuery('satelliteVersions', () => fetchSatelliteVersions());
};

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
