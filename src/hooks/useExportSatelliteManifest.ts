import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig } from '../utilities/platformServices';

interface TriggerManifestExportResponse {
  body: {
    exportJobID: string;
    href: string;
  };
}

interface ExportManifestStatusResponse {
  body: {
    exportID: string;
    href: string;
  };
}

const triggerManifestExport = (uuid: string): Promise<TriggerManifestExportResponse> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}/export`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
    mode: 'cors'
  }).then((response) => {
    return response.json();
  });
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getManifestExportStatus = async (
  uuid: string,
  exportJobID: string
): Promise<ExportManifestStatusResponse> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  const response = await fetch(
    `${rhsmAPIBase}/management/v1/allocations/${uuid}/exportJob/${exportJobID}`,
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
      mode: 'cors'
    }
  );

  if (response.status === 200) {
    return response.json();
  } else if (response.status === 202 || response.status === 404) {
    // Export not ready, we need to pause and retry.
    await sleep(5000);
    return getManifestExportStatus(uuid, exportJobID);
  } else {
    throw new Error('Error fetching status of exported manifest');
  }
};

const downloadExportedManifest = (uuid: string, exportID: string): Promise<Blob> => {
  const jwtToken = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  return fetch(`${rhsmAPIBase}/management/v1/allocations/${uuid}/export/${exportID}`, {
    headers: { Authorization: `Bearer ${jwtToken}`, 'Content-type': 'application/zip' },
    mode: 'cors'
  }).then((response) => response.blob());
};

const exportManifest = async (uuid: string): Promise<Blob> => {
  const triggerResponse = await triggerManifestExport(uuid);

  const statusResponse = await getManifestExportStatus(uuid, triggerResponse.body.exportJobID);

  const downloadResponse = await downloadExportedManifest(uuid, statusResponse.body.exportID);

  return downloadResponse;
};

const useExportSatelliteManifest = (
  uuid: string,
  shouldLoadOnRender: boolean
): QueryObserverResult<Blob, Error> => {
  return useQuery<Blob, Error>(['exportedManifests', uuid], () => exportManifest(uuid), {
    enabled: shouldLoadOnRender,
    // retries off because export can potentially take 10+ minutes.
    retry: false
  });
};

export {
  ExportManifestStatusResponse,
  downloadExportedManifest,
  getManifestExportStatus,
  triggerManifestExport,
  TriggerManifestExportResponse,
  useExportSatelliteManifest as default
};
