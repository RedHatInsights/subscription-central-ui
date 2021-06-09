import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

const exportSatelliteManifest = (uuid: string): Promise<any> => {
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}/export`, {
    headers: { Authorization: `Bearer ${cs_jwt}` },
    mode: 'cors'
  })
    .then((response) => {
      console.log('here!', response.body);
      return response.json();
    })
    .catch((e) => {
      console.error('Error fetching Manifest Entitlements data', e);
    });
};

const useExportSatelliteManifest = (uuid: string): QueryObserverResult<any, unknown> => {
  return useQuery<any, Error>(['manifestEntitlements', uuid], () => exportSatelliteManifest(uuid));
};

export { useExportSatelliteManifest as default };
