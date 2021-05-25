import Cookies from 'js-cookie';
import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { getConfig } from '../utilities/platformServices';
import { ManifestEntry } from './useSatelliteManifests';

interface UpdateManifestSCAStatusParams {
  uuid: string;
  newSCAStatus: string;
}

interface UpdateManifestSCAStatus {
  success: boolean;
  status: number;
}

const updateManifestSCAStatus = (
  data: UpdateManifestSCAStatusParams
): Promise<void | UpdateManifestSCAStatus> => {
  const { uuid, newSCAStatus } = data;
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();

  const requestData = {
    simpleContentAccess: newSCAStatus
  };

  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${jwtToken}` },
    body: JSON.stringify(requestData)
  })
    .then((response) => {
      if (response.status !== 204) {
        throw new Error(
          `Status Code ${response.status}.  Error updating SCA status: ${response.statusText}.  `
        );
      }
      return { success: true, status: response.status };
    })
    .catch((e) => {
      console.error(e);
    });
};

const updateManifestSCAQueryData = (
  oldManifestEntryData: ManifestEntry[],
  uuid: string,
  newSCAStatus: string
): ManifestEntry[] => {
  return oldManifestEntryData.map((manifestEntry) => {
    if (manifestEntry.uuid === uuid) {
      const updatedManifestEntry = manifestEntry;
      updatedManifestEntry.simpleContentAccess = newSCAStatus;
      return updatedManifestEntry;
    } else {
      return manifestEntry;
    }
  });
};

const useUpdateManifestSCAStatus = (): UseMutationResult<
  void | UpdateManifestSCAStatus,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (updateManifestSCAStatusParams: UpdateManifestSCAStatusParams) =>
      updateManifestSCAStatus(updateManifestSCAStatusParams),
    {
      onSuccess: (data, updateManifestSCAStatusParams) => {
        if (!data) return;

        const { uuid, newSCAStatus } = updateManifestSCAStatusParams;

        queryClient.setQueryData('manifests', (oldManifestEntryData: ManifestEntry[]) =>
          updateManifestSCAQueryData(oldManifestEntryData, uuid, newSCAStatus)
        );
      }
    }
  );
};

export {
  UpdateManifestSCAStatusParams,
  updateManifestSCAStatus,
  useUpdateManifestSCAStatus as default
};
