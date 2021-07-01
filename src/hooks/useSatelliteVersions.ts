import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = (): Promise<any> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/versions`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
  }).then((response) => response.json());
};

const useSatelliteVersions = () => {
  return useQuery('satelliteVersions', () => fetchSatelliteVersions());
};

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
