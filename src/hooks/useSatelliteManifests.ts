import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

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

const fetchSatelliteManifestData = async (
  offset = 0,
  previousData: ManifestEntry[] = []
): Promise<ManifestEntry[]> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  const limit = 100;

  const response = await fetch(
    `${rhsmAPIBase}/management/v1/allocations?type=Satellite&offset=${offset}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
      mode: 'cors'
    }
  );

  const manifestResponseData: SatelliteManifestAPIData = await response.json();

  if (manifestResponseData.pagination.count === limit) {
    // Fetch the next page's data
    const newOffset = offset + limit;
    return previousData.concat(
      await fetchSatelliteManifestData(newOffset, manifestResponseData.body)
    );
  } else {
    return previousData.concat(manifestResponseData.body);
  }
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
