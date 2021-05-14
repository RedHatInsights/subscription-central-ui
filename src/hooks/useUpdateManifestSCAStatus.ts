import Cookies from 'js-cookie';
import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { getConfig } from '../utilities/platformServices';
import { ManifestEntry } from './useSatelliteManifests';

interface UpdateManifestSCAStatusParams {
  uuid: string;
  newSCAStatus: string;
}

const updateManifestSCAStatus = (data: UpdateManifestSCAStatusParams): Promise<Response> => {
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
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(
          `Status Code ${response.status}.  Error updating SCA status: ${response.statusText}.  `
        );
      }
      return response.json();
    })
    .catch((e) => {
      console.error(e);
    });
};

const useUpdateManifestSCAStatus = (): UseMutationResult<Response, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(
    (updateManifestSCAStatusParams: UpdateManifestSCAStatusParams) =>
      updateManifestSCAStatus(updateManifestSCAStatusParams),
    {
      onSuccess: (data, updateManifestSCAStatusParams) => {
        if (!data) return;

        const { uuid, newSCAStatus } = updateManifestSCAStatusParams;

        queryClient.setQueryData('manifests', (oldData: ManifestEntry[]) =>
          oldData.map((manifestEntry) => {
            if (manifestEntry.uuid === uuid) {
              const newManifestEntry = manifestEntry;
              newManifestEntry.simpleContentAccess = newSCAStatus;
              return newManifestEntry;
            } else {
              return manifestEntry;
            }
          })
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
