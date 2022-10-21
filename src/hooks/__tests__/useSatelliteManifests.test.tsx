import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import useSatelliteManifests, {
  SatelliteManifestAPIData,
  getOnlyManifestsV6AndHigher,
  ManifestEntry,
  fetchSatelliteManifestData
} from '../useSatelliteManifests';
import { createQueryWrapper } from '../../utilities/testHelpers';
import factories from '../../utilities/factories';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

Object.defineProperty(window, 'insights', {
  value: {
    chrome: {
      auth: {
        getToken: jest.fn()
      }
    }
  }
});

describe('useSatelliteManifests hook', () => {
  it('passes manifests back when fetching from API', async () => {
    const manifestData = [
      {
        entitlementQuantity: 1,
        name: 'manifest1',
        type: 'Satellite',
        url: 'foo.com',
        uuid: 'abc123',
        version: '6.2',
        simpleContentAccess: 'enabled'
      }
    ];

    const mockResponse: SatelliteManifestAPIData = {
      body: [...manifestData],
      pagination: {
        count: 10,
        limit: 100,
        offset: 0
      }
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const { result, waitFor } = renderHook(() => useSatelliteManifests(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(manifestData);
  });

  it('passes back data from multiple paginated calls', async () => {
    const manifestData1 = factories.manifestEntry.buildList(2);
    const manifestData2 = factories.manifestEntry.buildList(2);
    const manifestData3 = factories.manifestEntry.buildList(1);

    const mockResponse1: SatelliteManifestAPIData = {
      body: [...manifestData1],
      pagination: {
        count: manifestData1.length,
        limit: 2,
        offset: 0
      }
    };

    const mockResponse2: SatelliteManifestAPIData = {
      body: [...manifestData2],
      pagination: {
        count: manifestData2.length,
        limit: 2,
        offset: 2
      }
    };

    const mockResponse3: SatelliteManifestAPIData = {
      body: [...manifestData3],
      pagination: {
        count: manifestData3.length,
        limit: 2,
        offset: 4
      }
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse1));
    fetch.mockResponseOnce(JSON.stringify(mockResponse2));
    fetch.mockResponseOnce(JSON.stringify(mockResponse3));

    const { result, waitFor } = renderHook(() => useSatelliteManifests(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual([...manifestData1, ...manifestData2, ...manifestData3]);
    expect(result.current.data.length).toEqual(5);
  });

  it('enters isError state within react-query when API fetch fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    fetch.mockRejectedValueOnce({
      error: 'Error getting manifests'
    });

    const { result, waitFor } = renderHook(() => useSatelliteManifests(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isError);

    expect(result.current.data).toEqual(undefined);
    console.error = originalError;
  });

  it('throws an error when not 200', async () => {
    fetch.mockResponse(JSON.stringify({}), { status: 404 });

    try {
      await fetchSatelliteManifestData();
    } catch (e) {
      expect(e.message).toContain('Error fetching manifest data:');
    }
  });
});

describe('getOnlyManifestsV6AndHigher method', () => {
  it('filters out manifests that are not at least v6', () => {
    const manifest1: ManifestEntry = {
      entitlementQuantity: 1,
      name: 'manifest1',
      type: 'Satellite',
      url: 'foo.com',
      uuid: 'abc123',
      version: '6.2',
      simpleContentAccess: 'enabled'
    };
    const manifest2: ManifestEntry = {
      entitlementQuantity: 1,
      name: 'manifest2',
      type: 'Satellite',
      url: 'foo.com',
      uuid: 'abc123',
      version: '5.2',
      simpleContentAccess: 'enabled'
    };
    const manifestData: ManifestEntry[] = [manifest1, manifest2];

    expect(getOnlyManifestsV6AndHigher(manifestData)).toEqual([manifest1]);
  });
});
