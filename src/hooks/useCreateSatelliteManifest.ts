import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { getConfig } from '../utilities/platformServices';

export interface CreateManifestParams {
  name: string;
  version: string;
}

const createSatelliteManifest = (data: CreateManifestParams) => {
  const { name, version } = data;
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations?name=${name}&version=${version}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cs_jwt}` }
  })
    .then((response) => {
      console.log('response', response, response.status, typeof response.status);
      if (response.status > 200) {
        throw new Error(`Error creating manifest: ${response.statusText} - ${response.type}`);
      }
      return response.json();
    })
    .catch((e) => {
      console.error('Error creating Satellite Manifest data', e);
    });
};

export const useCreateSatelliteManifest = () => {
  const queryClient = useQueryClient();
  return useMutation((newManifest: CreateManifestParams) => createSatelliteManifest(newManifest), {
    onSuccess: () => {
      queryClient.invalidateQueries('manifests');
    }
  });
};
