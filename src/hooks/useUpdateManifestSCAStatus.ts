import Cookies from 'js-cookie';
import { useMutation, useQueryClient, UseMutationResult, QueryClient } from 'react-query';
import { getConfig } from '../utilities/platformServices';
import { ManifestEntry } from './useSatelliteManifests';
import { ManifestEntitlementsData } from './useManifestEntitlements';

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

  const newEntitlementData = {
    body: { ...oldEntitlementsData.body, simpleContentAccess: newSCAStatus }
  };

  queryClient.setQueryData(['manifestEntitlements', uuid], newEntitlementData);
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
