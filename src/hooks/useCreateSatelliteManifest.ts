import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { getConfig } from '../utilities/platformServices';

interface CreateManifestParams {
  name: string;
  version: string;
}

const createSatelliteManifest = (data: CreateManifestParams) => {
  const { name, version } = data;
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations?name=${name}&version=${version}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwtToken}` }
  })
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
    onSuccess: (data: any) => {
      if (typeof data !== 'undefined') queryClient.invalidateQueries('manifests');
    }
  });
};

export { CreateManifestParams, createSatelliteManifest, useCreateSatelliteManifest as default };
