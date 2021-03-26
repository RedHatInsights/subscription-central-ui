import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';

export interface ManifestEntry {
  entitlementQuantity: number;
  name: string;
  type: string;
  url: string;
  uuid: string;
  version: string;
  simpleContentAccess?: string;
}

interface SatelliteManifestAPIData {
  body: ManifestEntry[];
  pagination: {
    count: number;
    limit: number;
    offset: number;
  };
}

export const fetchSatelliteManifestData = () => {
  const cs_jwt = Cookies.get('cs_jwt');
  return fetch('https://api.access.qa.redhat.com/management/v1/allocations', {
    headers: { Authorization: `Bearer ${cs_jwt}` },
    mode: 'cors'
  })
    .then((response) => response.json())
    .catch((e) => {
      console.error('Error fetching Satellite Manifest data', e);
    });
};

export const getOnlySatelliteManifests = (data: ManifestEntry[] = []): ManifestEntry[] => {
  return data.filter((manifest: ManifestEntry) => manifest.type === 'Satellite');
};

export const getOnlyManifestsV6AndHigher = (data: ManifestEntry[] = []): ManifestEntry[] => {
  return data.filter((manifest) => parseInt(manifest.version) >= 6);
};

export const filterSatelliteData = (data: SatelliteManifestAPIData): ManifestEntry[] => {
  const satelliteData = getOnlySatelliteManifests(data.body);
  const manifestsV6AndHigher = getOnlyManifestsV6AndHigher(satelliteData);
  return manifestsV6AndHigher;
};

export const getSatelliteManifests = (): Promise<ManifestEntry[]> => {
  return fetchSatelliteManifestData()
    .then((data: SatelliteManifestAPIData) => filterSatelliteData(data))
    .catch((e: Error) => {
      throw new Error(`Error fetching Satellite Manifest data: ${e.message}`);
    });
};

const useSatelliteManifests = (): QueryObserverResult<ManifestEntry[], unknown> => {
  return useQuery('manifests', () => getSatelliteManifests());
};

export { useSatelliteManifests as default };
