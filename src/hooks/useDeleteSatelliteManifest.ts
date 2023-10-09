import { useMutation, useQueryClient } from 'react-query';
import { useToken } from '../utilities/platformServices';
import { ManifestEntry } from './useSatelliteManifests';

const deleteSatelliteManifest = (jwtToken: Promise<string>) => async (uuid: string) => {
  return fetch(`/api/rhsm/v2/manifests/${uuid}?force=true`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${await jwtToken}` }
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
  const jwtToken = useToken();
  return useMutation((uuid: string) => deleteSatelliteManifest(jwtToken)(uuid), {
    onSuccess: (_, uuid) => {
      queryClient.setQueryData('manifests', (oldData: ManifestEntry[]) =>
        oldData.filter((entry) => entry.uuid != uuid)
      );
    }
  });
};

export { deleteSatelliteManifest, useDeleteSatelliteManifest as default };
