import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, fireEvent, waitFor } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import useExportSatelliteManifest, {
  downloadExportedManifest,
  ExportManifestStatusResponse,
  getManifestExportStatus,
  triggerManifestExport,
  TriggerManifestExportResponse
} from '../useExportSatelliteManifest';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
  jest.setTimeout(10000);
});

describe('triggerManifestExport method', () => {
  it('gets data back with a successful API response', async () => {
    const triggerManifestExportResponse: TriggerManifestExportResponse = {
      body: {
        exportJobID: 'ab123',
        href: 'foo.com'
      }
    };

    fetch.mockResponseOnce(JSON.stringify(triggerManifestExportResponse));

    const result = await triggerManifestExport('abd123');
    expect(result).toEqual(triggerManifestExportResponse);
  });
});

describe('getManifestExportStatus method', () => {
  it('gets data back with a successful API response', async () => {
    const exportManifestStatusResponse: ExportManifestStatusResponse = {
      body: {
        exportID: 'abc123',
        href: 'foo.com'
      }
    };

    fetch.mockResponseOnce(JSON.stringify(exportManifestStatusResponse));

    const result = await getManifestExportStatus('123456', 'abc123');
    expect(result).toEqual(exportManifestStatusResponse);
  });

  it('retries if the first response is a 404', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 404 });

    const exportManifestStatusResponse: ExportManifestStatusResponse = {
      body: {
        exportID: 'abc123',
        href: 'foo.com'
      }
    };

    fetch.mockResponseOnce(JSON.stringify(exportManifestStatusResponse));

    const result = await getManifestExportStatus('123456', 'abc123');
    expect(result).toEqual(exportManifestStatusResponse);
  });

  it('throws an error if not 200, 202 or 404', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 401 });

    try {
      await getManifestExportStatus('123456', 'abc123');
    } catch (e) {
      expect(e.message).toEqual('Error fetching status of exported manifest');
    }
  });
});

describe('downloadExportedManifest', () => {
  it('returns a Blob with zip file data', async () => {
    const downloadResponse = new Blob(['test'], { type: 'application/zip' });

    fetch.mockResponseOnce(JSON.stringify(downloadResponse));

    const result = await downloadExportedManifest('123456', 'abc123');
    expect(result.constructor.name).toEqual('Blob');
  });
});

describe('useExportSatelliteManifests hook', () => {
  it('returns the zip file after calling all three APIs', async () => {
    const triggerManifestExportResponse: TriggerManifestExportResponse = {
      body: {
        exportJobID: 'ab123',
        href: 'foo.com'
      }
    };

    fetch.mockResponseOnce(JSON.stringify(triggerManifestExportResponse));

    const exportManifestStatusResponse: ExportManifestStatusResponse = {
      body: {
        exportID: '123456',
        href: 'foo.com'
      }
    };

    fetch.mockResponseOnce(JSON.stringify(exportManifestStatusResponse));

    const downloadResponse = new Blob(['testing'], { type: 'application/zip' });

    fetch.mockResponseOnce(JSON.stringify(downloadResponse));

    const Page = () => {
      const { mutate: exportManifest, isSuccess } = useExportSatelliteManifest();
      return (
        <div>
          <h1 data-testid="title">{isSuccess && 'Success'}</h1>
          <button onClick={() => exportManifest({ uuid: 'foo' })}>mutate</button>
        </div>
      );
    };

    const queryClient = new QueryClient();

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );

    expect(getByTestId('title').textContent).toBe('');
    fireEvent.click(getByText('mutate'));
    await waitFor(() => getByTestId('title'));
    expect(getByTestId('title').textContent).toBe('Success');
  });
});
