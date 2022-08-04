import React from 'react';
import { Button } from '@patternfly/react-core';
import { SortByDirection } from '@patternfly/react-table';
import ManifestEntitlementsListContainer from '../ManifestEntitlementsList/ManifestEntitlementsListContainer';
import SCAStatusSwitch from '../SCAStatusSwitch';
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
  cells: string[];
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

export const getTableHeaders = (user: User): (string | React.ReactNode)[] => {
  const tableHeaders = [
    'Name',
    'Version',
    <React.Fragment key="0">
      Simple Content Access
      <SCAInfoIconWithPopover />
    </React.Fragment>,
    'UUID'
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

export const getFilteredRows = (data: ManifestEntry[], searchValue: string): string[][] => {
  return filterDataBySearchTerm(data, searchValue).map((entry: ManifestEntry) => {
    let scaStatus = entry.simpleContentAccess || 'disabled';
    const manifestVersion = semver.coerce(entry.version);
    const allowedSCAVersion = semver.coerce('6.3');
    if (semver.lt(manifestVersion, allowedSCAVersion)) {
      scaStatus = 'disallowed';
    }

    return [entry.name, entry.version, scaStatus, entry.uuid];
  });
};

export const getManifestName = (data: ManifestEntry[], uuid: string): string => {
  return data.find((entry) => entry.uuid == uuid)?.name;
};

export const sortFilteredRows = (filteredRows: string[][], sortBy: SortBy): string[][] => {
  const { direction, index } = sortBy;
  const directionFactor = direction === SortByDirection.desc ? -1 : 1;
  const sortedRows = filteredRows.sort(
    (a: [string, string, string, string], b: [string, string, string, string]) => {
      const term1 = a[index].toLowerCase();
      const term2 = b[index].toLowerCase();
      if (term1 < term2) {
        return -1 * directionFactor;
      } else if (term1 > term2) {
        return 1 * directionFactor;
      } else {
        return 0;
      }
    }
  );

  return sortedRows;
};

export const getSortedRows = (
  data: ManifestEntry[],
  searchValue: string,
  sortBy: SortBy
): string[][] => {
  const filteredRows = getFilteredRows(data, searchValue);
  const sortedRows = sortFilteredRows(filteredRows, sortBy);
  return sortedRows;
};

export const getPaginatedRows = (
  data: ManifestEntry[],
  searchValue: string,
  page: number,
  perPage: number,
  sortBy: SortBy
): string[][] => {
  const first = (page - 1) * perPage;
  const last = first + perPage;

  return getSortedRows(data, searchValue, sortBy).slice(first, last);
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
  sortBy: SortBy
): Row[] => {
  /**
   * Go through each row and add a toggleable row
   * with details beneath it.
   */

  const currentPageRows = getPaginatedRows(data, searchValue, page, perPage, sortBy);

  const rowsWithAllocationDetails: Row[] = [];

  currentPageRows.forEach((row, i) => {
    const uuid = row[3];
    const isOpen = rowExpandedStatus[uuid] || false;
    const parentIndex = (i + 1) * 2 - 2;
    const expandedContent = isOpen ? (
      <ManifestEntitlementsListContainer uuid={uuid} entitlementsRowRef={entitlementsRowRefs[i]} />
    ) : (
      ''
    );

    const details = { parent: parentIndex, content: expandedContent };

    // Add row with details
    rowsWithAllocationDetails.push({ isOpen, cells: row, details: details });
  });

  return rowsWithAllocationDetails;
};
