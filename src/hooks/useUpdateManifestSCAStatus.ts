import { useMutation, useQueryClient, UseMutationResult, QueryClient } from 'react-query';
import { ManifestEntry } from './useSatelliteManifests';
import { ManifestEntitlementsData } from './useManifestEntitlements';
import { useToken } from '../utilities/platformServices';

interface UpdateManifestSCAStatusParams {
  uuid: string;
  newSCAStatus: string;
}

interface UpdateManifestSCAStatus {
  success: boolean;
  status: number;
}

const updateManifestSCAStatus =
  (jwtToken: Promise<string>) =>
  async (data: UpdateManifestSCAStatusParams): Promise<void | UpdateManifestSCAStatus> => {
    const { uuid, newSCAStatus } = data;

    const requestData = {
      simpleContentAccess: newSCAStatus
    };

    return fetch(`/api/rhsm/v2/manifests/${uuid}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${await jwtToken}` },
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
  queryClient: QueryClient,
  uuid: string,
  newSCAStatus: string
): void => {
  const oldManifestEntryData: ManifestEntry[] = queryClient.getQueryData('manifests');

  const newManifestEntryData: ManifestEntry[] = oldManifestEntryData.map((manifestEntry) => {
    if (manifestEntry.uuid === uuid) {
      const updatedManifestEntry = { ...manifestEntry };
      updatedManifestEntry.simpleContentAccess = newSCAStatus;
      return updatedManifestEntry;
    } else {
      return manifestEntry;
    }
  });

  queryClient.setQueryData('manifests', newManifestEntryData);
};

const updateManifestEntitlementsData = (
  queryClient: QueryClient,
  uuid: string,
  newSCAStatus: string
): void => {
  const oldEntitlementsData: ManifestEntitlementsData = queryClient.getQueryData([
    'manifestEntitlements',
    uuid
  ]);

  if (!oldEntitlementsData) return;

  const newEntitlementsData = {
    body: { ...oldEntitlementsData.body, simpleContentAccess: newSCAStatus }
  };

  queryClient.setQueryData(['manifestEntitlements', uuid], newEntitlementsData);
};

const useUpdateManifestSCAStatus = (): UseMutationResult<
  void | UpdateManifestSCAStatus,
  unknown
> => {
  const queryClient = useQueryClient();
  const jwtToken = useToken();
  return useMutation(
    (updateManifestSCAStatusParams: UpdateManifestSCAStatusParams) =>
      updateManifestSCAStatus(jwtToken)(updateManifestSCAStatusParams),
    {
      onSuccess: (data, updateManifestSCAStatusParams) => {
        if (!data) return;

        const { uuid, newSCAStatus } = updateManifestSCAStatusParams;

        updateManifestSCAQueryData(queryClient, uuid, newSCAStatus);

        updateManifestEntitlementsData(queryClient, uuid, newSCAStatus);
      }
    }
  );
};

export {
  UpdateManifestSCAStatusParams,
  updateManifestSCAStatus,
  useUpdateManifestSCAStatus as default
};
