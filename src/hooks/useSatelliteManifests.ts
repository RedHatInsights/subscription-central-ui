import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';

type ManifestEntry = {
  entitlementQuantity: number;
  name: string;
  type: string;
  url: string;
  uuid: string;
  version: string;
  simpleContentAccess: string;
};

interface SatelliteManifestAPIData {
  body: ManifestEntry[];
  pagination: {
    count: number;
    limit: number;
    offset: number;
  };
}

const fetchSatelliteManifestData = async (offset = 0): Promise<ManifestEntry[]> => {
  const jwtToken = Cookies.get('cs_jwt');

  const response = await fetch(`/api/rhsm/v2/manifests?type=Satellite&offset=${offset}`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  const manifestResponseData: SatelliteManifestAPIData = await response.json();

  const { count, limit } = manifestResponseData.pagination;

  const manifests: ManifestEntry[] = manifestResponseData.body;

  if (count === limit) {
    // Fetch the next page's data
    const newOffset = offset + limit;

    const additionalManifests = await fetchSatelliteManifestData(newOffset);

    manifests.push(...additionalManifests);
  }

  return manifests;
};

const getOnlyManifestsV6AndHigher = (data: ManifestEntry[]): ManifestEntry[] => {
  return data.filter((manifest) => parseInt(manifest.version) >= 6);
};

const getSatelliteManifests = async (): Promise<ManifestEntry[]> => {
  const manifestData = await fetchSatelliteManifestData();
  return getOnlyManifestsV6AndHigher(manifestData);
};

const useSatelliteManifests = (): QueryObserverResult<ManifestEntry[], unknown> => {
  return useQuery('manifests', () => getSatelliteManifests());
};

export {
  ManifestEntry,
  fetchSatelliteManifestData,
  getOnlyManifestsV6AndHigher,
  getSatelliteManifests,
  SatelliteManifestAPIData,
  useSatelliteManifests as default
};
