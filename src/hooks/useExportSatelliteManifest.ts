import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

interface ExportSatelliteManifestResponse {
  body: {
    exportJobID: string;
    href: string;
  };
}

interface PollResponse {
  body: {
    exportID: string;
    href: string;
  };
}

const triggerManifestExport = (uuid: string): Promise<ExportSatelliteManifestResponse> => {
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}/export`, {
    headers: { Authorization: `Bearer ${cs_jwt}` },
    mode: 'cors'
  }).then((response) => {
    return response.json();
  });
};

const getManifestExportStatus = (uuid: string, exportJobID: string): Promise<PollResponse> => {
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}/exportJob/${exportJobID}`, {
    headers: { Authorization: `Bearer ${cs_jwt}` },
    mode: 'cors'
  }).then((response) => response.json());
};

const downloadExportedManifest = (uuid: string, exportID: string): Promise<Blob> => {
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}/export/${exportID}`, {
    headers: { Authorization: `Bearer ${cs_jwt}`, 'Content-type': 'application/zip' },
    mode: 'cors'
  })
    .then((response) => response.blob())
    .then((zipFile) => zipFile);
};

const exportManifest = async (uuid: string) => {
  const triggerRes = await triggerManifestExport(uuid);

  const exportStatusRes = await getManifestExportStatus(uuid, triggerRes.body.exportJobID);

  const downloadRes = await downloadExportedManifest(uuid, exportStatusRes.body.exportID);

  return downloadRes;
};

const useExportSatelliteManifest = (uuid: string): QueryObserverResult<any, Error> => {
  return useQuery<Blob, Error>(['exportedManifests', uuid], () => exportManifest(uuid), {
    // Do not run this hook immediately——only on click of export button
    enabled: false
    // retryDelay: 3 * 60 * 1000
  });
};

export { useExportSatelliteManifest as default };
