import React from 'react';
import { SortByDirection } from '@patternfly/react-table';
import ManifestEntitlementsListContainer from '../ManifestEntitlementsList/ManifestEntitlementsListContainer';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import { User } from '../../hooks/useUser';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import semver from 'semver';

export interface TableHeader {
  title: string | React.ReactNode;
}

export interface RowDetails {
  parent: number;
  content: string | React.ReactNode;
}

export interface Row {
  cells: ManifestRow;
  fullWidth?: boolean;
  noPadding?: boolean;
  parent?: number;
  isOpen?: boolean;
  details?: RowDetails;
}

export interface SortBy {
  index: number;
  direction: SortByDirection;
}

export interface BooleanDictionary {
  [key: string]: boolean;
}

export type SortKey = 'name' | 'version' | 'scaStatus' | 'uuid';

type ManifestTableHeader = {
  label: string | React.ReactNode;
  sortKey: SortKey;
};

export const getTableHeaders = (user: User): ManifestTableHeader[] => {
  const tableHeaders: ManifestTableHeader[] = [
    { label: 'Name', sortKey: 'name' },
    { label: 'Version', sortKey: 'version' },
    {
      label: (
        <React.Fragment key="0">
          Simple Content Access
          <SCAInfoIconWithPopover />
        </React.Fragment>
      ),
      sortKey: 'scaStatus'
    },
    { label: 'UUID', sortKey: 'uuid' }
  ];

  if (user.isSCACapable === false) {
    // remove SCA Status column
    tableHeaders.splice(2, 1);
  }
  return tableHeaders;
};

export const filterDataBySearchTerm = (
  data: ManifestEntry[],
  searchValue: string
): ManifestEntry[] => {
  return data.filter((entry: ManifestEntry) => {
    return (
      (entry.name || '').toLowerCase().includes(searchValue.toLowerCase().trim()) ||
      (entry.version || '').toLowerCase().includes(searchValue.toLowerCase().trim()) ||
      (entry.uuid || '').toLowerCase().includes(searchValue.toLowerCase().trim())
    );
  });
};

export const countManifests = (data: ManifestEntry[], searchValue: string): number => {
  const filteredData = filterDataBySearchTerm(data, searchValue);
  return filteredData.length;
};

export type ManifestRow = {
  name: string;
  version: string;
  scaStatus: string;
  uuid: string;
};

export const getFilteredRows = (data: ManifestEntry[], searchValue: string): ManifestRow[] => {
  return filterDataBySearchTerm(data, searchValue).map((entry: ManifestEntry) => {
    let scaStatus = entry.simpleContentAccess || 'disabled';
    const manifestVersion = semver.coerce(entry.version);
    const allowedSCAVersion = semver.coerce('6.3');
    if (semver.lt(manifestVersion, allowedSCAVersion)) {
      scaStatus = 'disallowed';
    }

    return { name: entry.name, version: entry.version, scaStatus: scaStatus, uuid: entry.uuid };
  });
};

export const getManifestName = (data: ManifestEntry[], uuid: string): string => {
  return data.find((entry) => entry.uuid == uuid)?.name;
};

export const sortFilteredRows = (
  filteredRows: ManifestRow[],
  sortKey: SortKey,
  sortDirection: SortByDirection
): ManifestRow[] => {
  const directionFactor = sortDirection === SortByDirection.desc ? -1 : 1;
  const sortedRows = filteredRows.sort((a: ManifestRow, b: ManifestRow) => {
    let aValue;
    let bValue;
    if (sortKey == 'version') {
      aValue = fixedVersionForComparison(a.version);
      bValue = fixedVersionForComparison(b.version);
    } else {
      aValue = a[sortKey].toLowerCase();
      bValue = b[sortKey].toLowerCase();
    }
    if (aValue < bValue) {
      return -1 * directionFactor;
    } else if (aValue > bValue) {
      return 1 * directionFactor;
    } else {
      return 0;
    }
  });

  return sortedRows;
};

const fixedVersionForComparison = (version: string): string => {
  version = version
    .split('.')
    .map((n) => +n + 100000)
    .join('.');

  return version;
};

export const getSortedRows = (
  data: ManifestEntry[],
  searchValue: string,
  sortKey: SortKey,
  sortDirection: SortByDirection
): ManifestRow[] => {
  const filteredRows = getFilteredRows(data, searchValue);
  const sortedRows = sortFilteredRows(filteredRows, sortKey, sortDirection);
  return sortedRows;
};

export const getPaginatedRows = (
  data: ManifestEntry[],
  searchValue: string,
  page: number,
  perPage: number,
  sortKey: SortKey,
  sortDirection: SortByDirection
): ManifestRow[] => {
  const first = (page - 1) * perPage;
  const last = first + perPage;

  return getSortedRows(data, searchValue, sortKey, sortDirection).slice(first, last);
};

export const getRowsWithAllocationDetails = (
  data: ManifestEntry[],
  user: User,
  searchValue: string,
  page: number,
  perPage: number,
  rowExpandedStatus: BooleanDictionary,
  handleRowManifestClick: (uuid: string, rowIndex: number) => void,
  entitlementsRowRefs: React.MutableRefObject<HTMLSpanElement | HTMLParagraphElement>[],
  sortKey: SortKey,
  sortDirection: SortByDirection
): Row[] => {
  /**
   * Go through each row and add a toggleable row
   * with details beneath it.
   */

  const currentPageRows = getPaginatedRows(
    data,
    searchValue,
    page,
    perPage,
    sortKey,
    sortDirection
  );

  const rowsWithAllocationDetails: Row[] = [];

  currentPageRows.forEach((row, i) => {
    const isOpen = rowExpandedStatus[row.uuid] || false;
    const parentIndex = (i + 1) * 2 - 2;
    const expandedContent = isOpen ? (
      <ManifestEntitlementsListContainer
        uuid={row.uuid}
        entitlementsRowRef={entitlementsRowRefs[i]}
      />
    ) : (
      ''
    );

    const details = { parent: parentIndex, content: expandedContent };

    // Add row with details
    rowsWithAllocationDetails.push({ isOpen, cells: row, details: details });
  });

  return rowsWithAllocationDetails;
};
