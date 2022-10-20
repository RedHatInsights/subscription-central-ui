import { useQuery } from 'react-query';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = async (): Promise<any> => {
  const jwtToken = await window.insights.chrome.auth.getToken();
  return fetch('/api/rhsm/v2/manifests/versions', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  }).then((response) => {
    if (response.status != 200) {
      throw new Error(`Failed to fetch satellite versions: ${response.statusText}`);
    }
    return response.json();
  });
};

const useSatelliteVersions = () => {
  return useQuery('satelliteVersions', () => fetchSatelliteVersions());
};

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
