import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useToken } from '../utilities/platformServices';

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

const triggerManifestExport =
  (jwtToken: Promise<string>) =>
  async (uuid: string): Promise<TriggerManifestExportResponse> => {
    return fetch(`/api/rhsm/v2/manifests/${uuid}/export`, {
      headers: { Authorization: `Bearer ${await jwtToken}` }
    }).then((response) => {
      if (response.status != 200) {
        throw new Error(`Failed to trigger export: ${response.statusText}`);
      }
      return response.json();
    });
  };

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getManifestExportStatus =
  (jwtToken: Promise<string>) =>
  async (uuid: string, exportJobID: string): Promise<ExportManifestStatusResponse> => {
    const response = await fetch(`/api/rhsm/v2/manifests/${uuid}/exportJob/${exportJobID}`, {
      headers: { Authorization: `Bearer ${await jwtToken}` }
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 202 || response.status === 404) {
      // Export not ready, we need to pause and retry.
      await sleep(5000);
      return getManifestExportStatus(jwtToken)(uuid, exportJobID);
    } else {
      throw new Error('Error fetching status of exported manifest');
    }
  };

const downloadExportedManifest =
  (jwtToken: Promise<string>) =>
  async (uuid: string, exportID: string): Promise<Blob> => {
    return fetch(`/api/rhsm/v2/manifests/${uuid}/export/${exportID}`, {
      headers: { Authorization: `Bearer ${await jwtToken}`, 'Content-Type': 'application/zip' }
    }).then((response) => {
      if (response.status != 200) {
        throw new Error(`Could not download manifest: ${response.statusText}`);
      }
      return response.blob();
    });
  };

const exportManifest =
  (jwtToken: Promise<string>) =>
  async (uuid: string): Promise<Blob> => {
    const triggerResponse = await triggerManifestExport(jwtToken)(uuid);

    const statusResponse = await getManifestExportStatus(jwtToken)(
      uuid,
      triggerResponse.body.exportJobID
    );

    const downloadResponse = await downloadExportedManifest(jwtToken)(
      uuid,
      statusResponse.body.exportID
    );

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
  const jwtToken = useToken();
  return useMutation({
    mutationFn: (exportManifestParams: ExportManifestParams) =>
      exportManifest(jwtToken)(exportManifestParams.uuid)
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
