import { useMutation, useQueryClient } from 'react-query';
import { useToken } from '../utilities/platformServices';
import { HttpError } from '../utilities/errors';

interface CreateManifestParams {
  name: string;
  version: string;
}

const createSatelliteManifest =
  (jwtToken: Promise<string>) => async (data: CreateManifestParams) => {
    const { name, version } = data;
    const response = await fetch(`/api/rhsm/v2/manifests?name=${name}&version=${version}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await jwtToken}` }
    });
    if (!response.ok) {
      throw new HttpError(
        `Status Code ${response.status}. Error creating manifest: ${response.statusText}.`,
        response.status,
        response.statusText
      );
    }
    return response.json();
  };

const useCreateSatelliteManifest = () => {
  const queryClient = useQueryClient();
  const token = useToken();
  return useMutation<any, HttpError, CreateManifestParams, unknown>(
    (newManifest) => createSatelliteManifest(token)(newManifest),
    {
      onSuccess: (data) => {
        if (typeof data !== 'undefined') {
          queryClient.invalidateQueries('manifests');
        }
      }
    }
  );
};
export { CreateManifestParams, createSatelliteManifest, useCreateSatelliteManifest as default };
