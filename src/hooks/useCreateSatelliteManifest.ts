import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';

interface CreateManifestParams {
  name: string;
  version: string;
}

const createSatelliteManifest = (data: CreateManifestParams) => {
  const { name, version } = data;
  const jwtToken = Cookies.get('cs_jwt');
  return fetch(
    `https://api.access.qa.redhat.com/management/v1/allocations?name=${name}&version=${version}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwtToken}` }
    }
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Status Code ${response.status}.  Error creating manifest: ${response.statusText}.  `
        );
      }
      return response.json();
    })
    .catch((e) => {
      console.error(e);
    });
};

const useCreateSatelliteManifest = () => {
  const queryClient = useQueryClient();
  return useMutation((newManifest: CreateManifestParams) => createSatelliteManifest(newManifest), {
    onSuccess: () => {
      queryClient.invalidateQueries('manifests');
    }
  });
};

export { CreateManifestParams, createSatelliteManifest, useCreateSatelliteManifest as default };
