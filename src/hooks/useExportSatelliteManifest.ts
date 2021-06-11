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

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getManifestExportStatus = async (
  uuid: string,
  exportJobID: string
): Promise<PollResponse> => {
  const cs_jwt = Cookies.get('cs_jwt');
  const { rhsmAPIBase } = getConfig();
  const response = await fetch(
    `${rhsmAPIBase}/management/v1/allocations/${uuid}/exportJob/${exportJobID}`,
    {
      headers: { Authorization: `Bearer ${cs_jwt}` },
      mode: 'cors'
    }
  );

  if (response.status === 200) {
    return response.json();
  }

  if (response.status === 202 || response.status === 404) {
    // Export not ready, we need to pause and retry.
    await sleep(5000);
    return getManifestExportStatus(uuid, exportJobID);
  }

  throw new Error('Error fetching status of exported manifest');
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
  const triggerExportResponse = await triggerManifestExport(uuid);

  const exportStatusResponse = await getManifestExportStatus(
    uuid,
    triggerExportResponse.body.exportJobID
  );

  const downloadManifestResponse = await downloadExportedManifest(
    uuid,
    exportStatusResponse.body.exportID
  );

  return downloadManifestResponse;
};

const useExportSatelliteManifest = (
  uuid: string,
  shouldLoadOnRender: boolean
): QueryObserverResult<Blob, Error> => {
  return useQuery<Blob, Error>(['exportedManifests', uuid], () => exportManifest(uuid), {
    enabled: shouldLoadOnRender,
    retryDelay: 5 * 60 * 1000
  });
};

export { useExportSatelliteManifest as default };
