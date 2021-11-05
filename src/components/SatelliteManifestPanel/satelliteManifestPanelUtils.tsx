import React from 'react';
import { Button } from '@patternfly/react-core';
import {
  sortable,
  cellWidth,
  expandable,
  IFormatter,
  ITransform,
  SortByDirection
} from '@patternfly/react-table';
import ManifestEntitlementsListContainer from '../ManifestEntitlementsList/ManifestEntitlementsListContainer';
import SCAStatusSwitch from '../SCAStatusSwitch';
import SCAInfoIconWithPopover from '../SCAInfoIconWithPopover';
import { User } from '../../hooks/useUser';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import semver from 'semver';

export interface TableHeader {
  title: string | React.ReactNode;
  transforms: ITransform[];
  cellFormatters?: IFormatter[];
}

export interface Row {
  cells: (string | JSX.Element | { title: React.ReactNode })[];
  fullWidth?: boolean;
  noPadding?: boolean;
  parent?: number;
  isOpen?: boolean;
}

export interface SortBy {
  index: number;
  direction: SortByDirection;
}

export interface BooleanDictionary {
  [key: string]: boolean;
}

export const getTableHeaders = (user: User): TableHeader[] => {
  const tableHeaders = [
    { title: 'Name', transforms: [sortable], cellFormatters: [expandable] },
    { title: 'Version', transforms: [sortable] },
    {
      title: (
        <>
          Simple Content Access
          <SCAInfoIconWithPopover />
        </>
      ),
      transforms: [sortable, cellWidth(20)]
    },
    { title: 'UUID', transforms: [sortable] }
  ];

  if (user.isSCACapable === false) {
    // remove SCA Status column
    tableHeaders.splice(2, 1);
  }
  return tableHeaders;
};

export const formatRow = (
  row: string[],
  rowIndex: number,
  handleRowManifestClick: (uuid: string, rowIndex: number) => void,
  user: User
): (string | JSX.Element)[] => {
  const name = row[0];
  const version = row[1];
  const scaStatus = row[2];
  const uuid = row[3];

  const formattedRow = [
    <React.Fragment key={`button-${uuid}`}>
      <Button
        data-testid={`expand-details-button-${rowIndex}`}
        variant="link"
        onClick={() => handleRowManifestClick(uuid, rowIndex)}
      >
        {name}
      </Button>
    </React.Fragment>,
    version,
    <React.Fragment key={`scastatusswitch-${uuid}`}>
      <SCAStatusSwitch scaStatus={scaStatus} uuid={uuid} />
    </React.Fragment>,
    uuid
  ];
  if (user.isSCACapable === false) {
    // remove SCA Status column
    formattedRow.splice(2, 1);
  }
  return formattedRow;
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
  /**
   * This adjustedIndex is necessary because Patternfly
   * has a strange quirk where, when a table has an
   * onCollapse attribute, its index starts at 1, which throws off
   * the sorting without the adjustment.
   */

  const adjustedIndex = index - 1;
  const directionFactor = direction === SortByDirection.desc ? -1 : 1;
  const sortedRows = filteredRows.sort(
    (a: [string, string, string], b: [string, string, string]) => {
      const term1 = a[adjustedIndex].toLowerCase();
      const term2 = b[adjustedIndex].toLowerCase();
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

    const formattedRow = formatRow(row, i, handleRowManifestClick, user);

    // Add original row
    rowsWithAllocationDetails.push({ isOpen, cells: [...formattedRow] });

    // Add details row
    rowsWithAllocationDetails.push({
      parent: parentIndex,
      fullWidth: true,
      noPadding: true,
      cells: [{ title: expandedContent }]
    });
  });

  return rowsWithAllocationDetails;
};
