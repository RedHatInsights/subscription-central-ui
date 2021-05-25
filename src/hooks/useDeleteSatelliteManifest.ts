import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { getConfig } from '../utilities/platformServices';
import { ManifestEntry } from './useSatelliteManifests';

const deleteSatelliteManifest = (uuid: string) => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}?force=true`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
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
    onSuccess: (data, uuid) => {
      queryClient.setQueryData('manifests', (oldData: ManifestEntry[]) =>
        oldData.filter((entry) => entry.uuid != uuid)
      );
    }
  });
};

export { deleteSatelliteManifest, useDeleteSatelliteManifest as default };
