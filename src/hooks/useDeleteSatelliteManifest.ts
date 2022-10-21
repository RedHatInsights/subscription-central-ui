import { useMutation, useQueryClient } from 'react-query';
import { ManifestEntry } from './useSatelliteManifests';

const deleteSatelliteManifest = async (uuid: string) => {
  const jwtToken = await window.insights.chrome.auth.getToken();
  return fetch(`/api/rhsm/v2/manifests/${uuid}?force=true`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${jwtToken}` }
  }).then((response) => {
    if (response.status != 204) {
      throw new Error(
        `Status Code ${response.status}.  Error deleting manifest: ${response.statusText}.`
      );
    }
  });
};

const useDeleteSatelliteManifest = () => {
  const queryClient = useQueryClient();
  return useMutation((uuid: string) => deleteSatelliteManifest(uuid), {
    onSuccess: (_, uuid) => {
      queryClient.setQueryData('manifests', (oldData: ManifestEntry[]) =>
        oldData.filter((entry) => entry.uuid != uuid)
      );
    }
  });
};

export { deleteSatelliteManifest, useDeleteSatelliteManifest as default };
