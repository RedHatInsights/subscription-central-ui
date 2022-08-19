import { useMutation, UseMutationResult } from 'react-query';

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

const triggerManifestExport = async (uuid: string): Promise<TriggerManifestExportResponse> => {
  const jwtToken = await window.insights.chrome.auth.getToken();
  return fetch(`/api/rhsm/v2/manifests/${uuid}/export`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
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
  const jwtToken = await window.insights.chrome.auth.getToken();
  const response = await fetch(`/api/rhsm/v2/manifests/${uuid}/exportJob/${exportJobID}`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

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

const downloadExportedManifest = async (uuid: string, exportID: string): Promise<Blob> => {
  const jwtToken = await window.insights.chrome.auth.getToken();
  return fetch(`/api/rhsm/v2/manifests/${uuid}/export/${exportID}`, {
    headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/zip' }
  }).then((response) => response.blob());
};

const exportManifest = async (uuid: string): Promise<Blob> => {
  const triggerResponse = await triggerManifestExport(uuid);

  const statusResponse = await getManifestExportStatus(uuid, triggerResponse.body.exportJobID);

  const downloadResponse = await downloadExportedManifest(uuid, statusResponse.body.exportID);

  return downloadResponse;
};

interface ExportManifestParams {
  uuid: string;
}

const useExportSatelliteManifest = (): UseMutationResult<
  Blob,
  unknown,
  ExportManifestParams,
  unknown
> => {
  return useMutation((exportManifestParams: ExportManifestParams) =>
    exportManifest(exportManifestParams.uuid)
  );
};

export {
  ExportManifestStatusResponse,
  downloadExportedManifest,
  getManifestExportStatus,
  triggerManifestExport,
  TriggerManifestExportResponse,
  useExportSatelliteManifest as default
};
