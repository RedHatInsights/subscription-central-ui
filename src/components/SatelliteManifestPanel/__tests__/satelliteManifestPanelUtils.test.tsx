import { SortByDirection } from '@patternfly/react-table';
import {
  filterDataBySearchTerm,
  getFilteredRows,
  getManifestName,
  sortFilteredRows,
  SortBy
} from '../satelliteManifestPanelUtils';
import { ManifestEntry } from '../../../hooks/useSatelliteManifests';

const manifest1: ManifestEntry = {
  name: 'first-manifest',
  entitlementQuantity: 1,
  type: 'Satellite',
  url: 'foo.com',
  uuid: '111111',
  version: '6.1',
  simpleContentAccess: 'enabled'
};

const manifest2: ManifestEntry = {
  name: 'second-manifest',
  entitlementQuantity: 1,
  type: 'Satellite',
  url: 'foo.com',
  uuid: '222222',
  version: '6.3',
  simpleContentAccess: 'enabled'
};

const manifest3: ManifestEntry = {
  name: 'third-manifest',
  entitlementQuantity: 1,
  type: 'Satellite',
  url: 'foo.com',
  uuid: '333333',
  version: '6.5',
  simpleContentAccess: 'enabled'
};

const mockData: ManifestEntry[] = [manifest1, manifest2, manifest3];

describe('sortFilteredRows method', () => {
  const filteredRows = [
    ['a-manifest', '6.9', 'enabled', '111111'],
    ['z-manifest', '6.0', 'enabled', '555555'],
    ['c-manifest', '6.4', 'disabled', '333333']
  ];

  it('sorts the rows by title ascending', () => {
    const sortBy: SortBy = { index: 1, direction: SortByDirection.asc };

    const filteredRowsSortedByManifestName = [
      ['a-manifest', '6.9', 'enabled', '111111'],
      ['c-manifest', '6.4', 'disabled', '333333'],
      ['z-manifest', '6.0', 'enabled', '555555']
    ];

    expect(sortFilteredRows(filteredRows, sortBy)).toEqual(filteredRowsSortedByManifestName);
  });

  it('sorts the rows by version descending', () => {
    const sortBy: SortBy = { index: 2, direction: SortByDirection.desc };

    const filteredRowsSortedByManifestVersionDescending = [
      ['a-manifest', '6.9', 'enabled', '111111'],
      ['c-manifest', '6.4', 'disabled', '333333'],
      ['z-manifest', '6.0', 'enabled', '555555']
    ];

    expect(sortFilteredRows(filteredRows, sortBy)).toEqual(
      filteredRowsSortedByManifestVersionDescending
    );
  });

  it('sorts the rows by sca status ascending', () => {
    const sortBy: SortBy = { index: 3, direction: SortByDirection.asc };

    const filteredRowsSortedByUUIDDescending = [
      ['c-manifest', '6.4', 'disabled', '333333'],
      ['a-manifest', '6.9', 'enabled', '111111'],
      ['z-manifest', '6.0', 'enabled', '555555']
    ];

    expect(sortFilteredRows(filteredRows, sortBy)).toEqual(filteredRowsSortedByUUIDDescending);
  });

  it('sorts the rows by uuid descending', () => {
    const sortBy: SortBy = { index: 4, direction: SortByDirection.desc };

    const filteredRowsSortedByUUIDDescending = [
      ['z-manifest', '6.0', 'enabled', '555555'],
      ['c-manifest', '6.4', 'disabled', '333333'],
      ['a-manifest', '6.9', 'enabled', '111111']
    ];

    expect(sortFilteredRows(filteredRows, sortBy)).toEqual(filteredRowsSortedByUUIDDescending);
  });
});

describe('getManifestName method', () => {
  it('returns the manifest name that matches the given UUID', () => {
    expect(getManifestName(mockData, '222222')).toEqual('second-manifest');
  });
});

describe('filterDataBySearchTerm method', () => {
  it('filters data properly based on a searched name', () => {
    expect(filterDataBySearchTerm(mockData, 'second-manifest')).toEqual([manifest2]);
  });

  it('filters data properly based on a searched version', () => {
    expect(filterDataBySearchTerm(mockData, '6.5')).toEqual([manifest3]);
  });

  it('filters data properly based on a searched UUID', () => {
    expect(filterDataBySearchTerm(mockData, '111111')).toEqual([manifest1]);
  });
});

describe('getFilteredRows method', () => {
  it('returns filtered rows and disallows SCA status if below 6.2', () => {
    const expectedRows: string[][] = [
      ['first-manifest', '6.1', 'disallowed', '111111'],
      ['second-manifest', '6.3', 'enabled', '222222'],
      ['third-manifest', '6.5', 'enabled', '333333']
    ];
    expect(getFilteredRows(mockData, '')).toEqual(expectedRows);
  });
});
