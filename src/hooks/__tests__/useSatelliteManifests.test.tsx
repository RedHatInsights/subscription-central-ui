import useSatelliteManifests, {
  SatelliteManifestAPIData,
  getOnlySatelliteManifests,
  getOnlyManifestsV6AndHigher,
  ManifestEntry
} from '../useSatelliteManifests';
import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { createQueryWrapper } from '../../utilities/testHelpers';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
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
});

describe('getOnlySatelliteManifests method', () => {
  it('filters out non-satellite manifests', () => {
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
      type: 'SAM',
      url: 'foo.com',
      uuid: 'abc123',
      version: '6.2',
      simpleContentAccess: 'enabled'
    };
    const manifestData: ManifestEntry[] = [manifest1, manifest2];

    expect(getOnlySatelliteManifests(manifestData)).toEqual([manifest1]);
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
