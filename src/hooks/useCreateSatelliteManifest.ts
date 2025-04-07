import { useMutation, useQueryClient } from 'react-query';
import { useToken } from '../utilities/platformServices';

interface CreateManifestParams {
  name: string;
  version: string;
}

const createSatelliteManifest =
  (jwtToken: Promise<string>) => async (data: CreateManifestParams) => {
    const { name, version } = data;
    return fetch(`/api/rhsm/v2/manifests?name=${name}&version=${version}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await jwtToken}` }
    }).then((response) => {
      if (response.status !== 200) {
        const error = new Error(
          `Status Code ${response.status}.  Error creating manifest: ${response.statusText}.  `
        );
        (error as any).status = response.status;
        throw error;
      }
      return response.json();
    });
  };

const useCreateSatelliteManifest = () => {
  const queryClient = useQueryClient();
  const token = useToken();
  return useMutation(
    (newManifest: CreateManifestParams) => createSatelliteManifest(token)(newManifest),
    {
      onSuccess: (data: any) => {
        if (typeof data !== 'undefined') queryClient.invalidateQueries('manifests');
      }
    }
  );
};

export { CreateManifestParams, createSatelliteManifest, useCreateSatelliteManifest as default };
