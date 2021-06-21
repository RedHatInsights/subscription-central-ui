import useSatelliteManifests, { SatelliteManifestAPIData } from '../useSatelliteManifests';
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
});
