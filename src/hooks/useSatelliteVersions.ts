/* eslint-disable @typescript-eslint/no-explicit-any -- outside of update scope, fix later*/
import { useQuery } from '@tanstack/react-query';
import { useToken } from '../utilities/platformServices';
import { HttpError } from '../utilities/errors';

interface SatelliteVersion {
  description: string;
  value: string;
}

const fetchSatelliteVersions = (jwtToken: Promise<string>) => async (): Promise<any> => {
  return fetch('/api/rhsm/v2/manifests/versions', {
    headers: { Authorization: `Bearer ${await jwtToken}` }
  }).then((response) => {
    if (response.status != 200) {
      throw new HttpError(
        `Failed to fetch satellite versions: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    return response.json();
  });
};

const useSatelliteVersions = () => {
  const jwtToken = useToken();
  return useQuery<any, HttpError, any, readonly ['satelliteVersions']>({
    queryKey: ['satelliteVersions'],
    queryFn: () => fetchSatelliteVersions(jwtToken)()
  });
};

export { fetchSatelliteVersions, SatelliteVersion, useSatelliteVersions as default };
