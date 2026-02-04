import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { useToken } from '../utilities/platformServices';

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

const fetchSatelliteManifestData =
  (jwtToken: Promise<string>) =>
  async (offset = 0): Promise<ManifestEntry[]> => {
    const response = await fetch(`/api/rhsm/v2/manifests?type=Satellite&offset=${offset}`, {
      headers: { Authorization: `Bearer ${await jwtToken}` }
    });

    if (response.status != 200) {
      throw new Error(`Error fetching manifest data: ${response.statusText}`);
    }

    const manifestResponseData: SatelliteManifestAPIData = await response.json();

    const { count, limit } = manifestResponseData.pagination;

    const manifests: ManifestEntry[] = manifestResponseData.body;

    if (count === limit) {
      // Fetch the next page's data
      const newOffset = offset + limit;

      const additionalManifests = await fetchSatelliteManifestData(jwtToken)(newOffset);

      manifests.push(...additionalManifests);
    }

    return manifests;
  };

const getOnlyManifestsV6AndHigher = (data: ManifestEntry[]): ManifestEntry[] => {
  return data.filter((manifest) => parseInt(manifest.version) >= 6);
};

const getSatelliteManifests = (jwtToken: Promise<string>) => async (): Promise<ManifestEntry[]> => {
  const manifestData = await fetchSatelliteManifestData(jwtToken)();
  return getOnlyManifestsV6AndHigher(manifestData);
};

const useSatelliteManifests = (): QueryObserverResult<ManifestEntry[], unknown> => {
  const jwtToken = useToken();
  return useQuery({ queryKey: ['manifests'], queryFn: () => getSatelliteManifests(jwtToken)() });
};

export {
  ManifestEntry,
  fetchSatelliteManifestData,
  getOnlyManifestsV6AndHigher,
  getSatelliteManifests,
  SatelliteManifestAPIData,
  useSatelliteManifests as default
};
