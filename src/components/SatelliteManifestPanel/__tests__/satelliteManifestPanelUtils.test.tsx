import { SortByDirection } from '@patternfly/react-table';
import {
  filterDataBySearchTerm,
  getFilteredRows,
  getManifestName,
  sortFilteredRows,
  ManifestRow
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

const manifest4: ManifestEntry = {
  name: 'manifest-6.10',
  entitlementQuantity: 1,
  type: 'Satellite',
  url: 'foo.com',
  uuid: 'abcd-1234',
  version: '6.10',
  simpleContentAccess: 'disabled'
};

const manifest5: ManifestEntry = {
  name: 'manifest-6.2',
  entitlementQuantity: 1,
  type: 'Satellite',
  url: 'foo.com',
  uuid: 'wxyz-5678',
  version: '6.2',
  simpleContentAccess: 'enabled'
};

const mockData: ManifestEntry[] = [manifest1, manifest2, manifest3, manifest4, manifest5];

describe('sortFilteredRows method', () => {
  const filteredRows = [
    { name: 'a-manifest', version: '6.9', scaStatus: 'enabled', uuid: '111111' },
    { name: 'z-manifest', version: '6.0', scaStatus: 'enabled', uuid: '555555' },
    { name: 'c-manifest', version: '6.4', scaStatus: 'disabled', uuid: '333333' }
  ];

  it('sorts the rows by title ascending', () => {
    const sortedRows = sortFilteredRows(filteredRows, 'name', SortByDirection.asc).map(
      (row) => row.name
    );
    expect(sortedRows).toEqual(['a-manifest', 'c-manifest', 'z-manifest']);
  });

  it('sorts the rows by version descending', () => {
    const sortedRows = sortFilteredRows(filteredRows, 'version', SortByDirection.desc).map(
      (row) => row.version
    );
    expect(sortedRows).toEqual(['6.9', '6.4', '6.0']);
  });

  it('sorts the rows by sca status ascending', () => {
    const sortedRows = sortFilteredRows(filteredRows, 'scaStatus', SortByDirection.asc).map(
      (row) => row.scaStatus
    );
    expect(sortedRows).toEqual(['disabled', 'enabled', 'enabled']);
  });

  it('sorts the rows by uuid descending', () => {
    const sortKey = 'uuid';
    const sortDirection = SortByDirection.desc;
    const sortedRows = sortFilteredRows(filteredRows, sortKey, sortDirection).map(
      (row) => row.uuid
    );
    expect(sortedRows).toEqual(['555555', '333333', '111111']);
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
    const expectedRows: ManifestRow[] = [
      { name: 'first-manifest', version: '6.1', scaStatus: 'disallowed', uuid: '111111' },
      { name: 'second-manifest', version: '6.3', scaStatus: 'enabled', uuid: '222222' },
      { name: 'third-manifest', version: '6.5', scaStatus: 'enabled', uuid: '333333' },
      { name: 'manifest-6.10', version: '6.10', scaStatus: 'disabled', uuid: 'abcd-1234' },
      { name: 'manifest-6.2', version: '6.2', scaStatus: 'disallowed', uuid: 'wxyz-5678' }
    ];
    expect(getFilteredRows(mockData, '')).toEqual(expectedRows);
  });
});
