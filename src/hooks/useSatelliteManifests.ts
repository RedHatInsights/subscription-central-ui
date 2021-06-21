import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

interface ManifestEntry {
  entitlementQuantity: number;
  name: string;
  type: string;
  url: string;
  uuid: string;
  version: string;
  simpleContentAccess: string;
}

interface SatelliteManifestAPIData {
  body: ManifestEntry[];
  pagination: {
    count: number;
    limit: number;
    offset: number;
  };
}

const fetchSatelliteManifestData = (): Promise<any> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations?type=Satellite`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
  }).then((response) => response.json());
};

const getOnlyManifestsV6AndHigher = (data: ManifestEntry[] = []): ManifestEntry[] => {
  return data.filter((manifest) => parseInt(manifest.version) >= 6);
};

const filterSatelliteData = (data: SatelliteManifestAPIData): ManifestEntry[] => {
  console.log('here', data.body);
  const manifestsV6AndHigher = getOnlyManifestsV6AndHigher(data.body);
  return manifestsV6AndHigher;
};

const getSatelliteManifests = (): Promise<ManifestEntry[]> => {
  return fetchSatelliteManifestData().then((data: SatelliteManifestAPIData) =>
    filterSatelliteData(data)
  );
};

const useSatelliteManifests = (): QueryObserverResult<ManifestEntry[], unknown> => {
  return useQuery('manifests', () => getSatelliteManifests());
};

export {
  ManifestEntry,
  fetchSatelliteManifestData,
  filterSatelliteData,
  getOnlyManifestsV6AndHigher,
  getOnlySatelliteManifests,
  getSatelliteManifests,
  SatelliteManifestAPIData,
  useSatelliteManifests as default
};
