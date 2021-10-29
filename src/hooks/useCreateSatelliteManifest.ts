import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';

interface CreateManifestParams {
  name: string;
  version: string;
}

const createSatelliteManifest = (data: CreateManifestParams) => {
  const { name, version } = data;
  const jwtToken = Cookies.get('cs_jwt');
  return fetch(`/api/rhsm/v2/manifests?name=${name}&version=${version}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwtToken}` }
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        `Status Code ${response.status}.  Error creating manifest: ${response.statusText}.  `
      );
    }
    return response.json();
  });
};

const useCreateSatelliteManifest = () => {
  const queryClient = useQueryClient();
  return useMutation((newManifest: CreateManifestParams) => createSatelliteManifest(newManifest), {
    onSuccess: (data: any) => {
      if (typeof data !== 'undefined') queryClient.invalidateQueries('manifests');
    }
  });
};

export { CreateManifestParams, createSatelliteManifest, useCreateSatelliteManifest as default };
