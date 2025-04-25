import React, { FunctionComponent, useState, useRef } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Drawer } from '@patternfly/react-core/dist/dynamic/components/Drawer';
import { DrawerContent } from '@patternfly/react-core/dist/dynamic/components/Drawer';
import { DrawerContentBody } from '@patternfly/react-core/dist/dynamic/components/Drawer';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { SearchInput } from '@patternfly/react-core/dist/dynamic/components/SearchInput';
import { Split } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { SplitItem } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import {
  ActionsColumn,
  ExpandableRowContent,
  Table /* data-codemods */,
  Tbody,
  Td,
  Th,
  ThProps,
  Thead,
  Tr,
  SortByDirection,
  IAction
} from '@patternfly/react-table';
import {
  BooleanDictionary,
  SortKey,
  countManifests,
  getTableHeaders,
  getManifestName,
  getRowsWithAllocationDetails
} from './satelliteManifestPanelUtils';
import { User } from '../../hooks/useUser';
import { CreateManifestPanel } from '../../components/emptyState';
import useNotifications from '../../hooks/useNotifications';
import useExportSatelliteManifest from '../../hooks/useExportSatelliteManifest';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';
import { NoSearchResults } from '../emptyState';
import CreateManifestButtonWithModal from '../CreateManifestButtonWithModal';
import { Processing } from '../emptyState';
import ManifestDetailSidePanel from '../ManifestDetailSidePanel';
import DeleteManifestConfirmationModal from '../DeleteManifestConfirmationModal';
import SCAStatusSwitch from '../SCAStatusSwitch';

interface SatelliteManifestPanelProps {
  data: ManifestEntry[] | undefined;
  isFetching: boolean;
  user: User;
}

const SatelliteManifestPanel: FunctionComponent<SatelliteManifestPanelProps> = ({
  data,
  isFetching,
  user
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState({ index: 0, direction: SortByDirection.asc });
  const [rowExpandedStatus, setRowExpandedStatus] = useState<BooleanDictionary>({});
  const [currentDetailUUID, setCurrentDetailUUID] = useState('');
  const [detailsDrawerIsExpanded, setDetailsDrawerIsExpanded] = useState(false);
  const [currentDetailRowIndex, setCurrentDetailRowIndex] = useState(null);
  const [isDeleteManifestConfirmationModalOpen, setIsDeleteManifestConfirmationModalOpen] =
    useState(false);
  const [currentDeletionUUID, setCurrentDeletionUUID] = useState('');
  const [currentDeletionName, setCurrentDeletionName] = useState('');
  const [shouldAddExportSuccessNotification, setShouldAddExportSuccessNotification] =
    useState(false);
  const [exportedManifestName, setExportedManifestName] = useState('');
  const [loadingManifestNotificationKey, setLoadingManifestNotificationKey] = useState('');
  const titleRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement | HTMLHeadingElement>(null);
  const entitlementsRowRefs = new Array(10)
    .fill(null)
    .map(() => useRef<HTMLSpanElement | HTMLParagraphElement>(null));

  const { addInfoNotification, addSuccessNotification, addErrorNotification } = useNotifications();

  const {
    data: exportedManifestData,
    mutate: triggerManifestExport,
    isLoading: isLoadingManifestExport,
    isSuccess: successExportingManifest,
    isError: errorExportingManifest
  } = useExportSatelliteManifest();

  const sortKeys: SortKey[] = [];

  const scrollToPageTop = () => {
    if (titleRef?.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const focusOnSidePanel = () => {
    if (drawerRef?.current) {
      drawerRef.current.focus({ preventScroll: true });
    }
  };

  const openDetailsPanel = (uuid: string, rowIndex: number): void => {
    setCurrentDetailUUID(uuid);
    setCurrentDetailRowIndex(rowIndex);
    setDetailsDrawerIsExpanded(true);
    scrollToPageTop();
    focusOnSidePanel();
  };

  const closeDetailsPanel = () => {
    setDetailsDrawerIsExpanded(false);
    setCurrentDetailUUID('');
  };

  const handlePerPageSelect = (_event: React.MouseEvent, perPage: number) => {
    setPerPage(perPage);
    setPage(1);
  };

  const handleSearch = (_: React.FormEvent, searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1);
    collapseAllRows();
  };

  const handleSetPage = (_event: React.MouseEvent, page: number) => {
    setPage(page);
    collapseAllRows();
  };

  const clearSearch = () => {
    setSearchValue('');
    setPage(1);
    collapseAllRows();
  };
  const handleSort = (_event: React.MouseEvent, index: number, direction: SortByDirection) => {
    setSortBy({ index, direction });
    setPage(1);
    collapseAllRows();
  };

  const handleDeleteManifestConfirmationModalToggle = () => {
    setIsDeleteManifestConfirmationModalOpen(!isDeleteManifestConfirmationModalOpen);
  };

  const openDeleteConfirmationModal = (uuid: string) => {
    setCurrentDeletionUUID(uuid);
    setCurrentDeletionName(getManifestName(data, uuid));
    handleDeleteManifestConfirmationModalToggle();
  };

  const handleRowManifestClick = (uuid: string, rowIndex: number): void => {
    openDetailsPanel(uuid, rowIndex);
  };

  const toggleRowExpansion = (rowUUID: string, expanded: boolean) => {
    const newRowExpandedStatus = { ...rowExpandedStatus };
    newRowExpandedStatus[rowUUID] = expanded;
    setRowExpandedStatus(newRowExpandedStatus);
  };

  const toggleAllocationDetails = (uuid: string) => {
    toggleRowExpansion(uuid, !rowExpandedStatus[uuid]);
  };

  const openCurrentEntitlementsListFromPanel = () => {
    closeDetailsPanel();
    toggleRowExpansion(currentDetailUUID, true);
    const currentRowRef = entitlementsRowRefs[currentDetailRowIndex];
    if (currentRowRef?.current) {
      currentRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const collapseAllRows = () => {
    setRowExpandedStatus({});
  };

  const exportManifest = (uuid: string, manifestName: string): void => {
    setExportedManifestName(manifestName);
    setShouldAddExportSuccessNotification(true);

    triggerManifestExport({ uuid });

    const infoNotificationKey = addInfoNotification(
      `Manifest ${manifestName} exporting. This may take some time. Please wait.`,
      { hasTimeout: false }
    );

    setLoadingManifestNotificationKey(infoNotificationKey);
  };

  if (successExportingManifest && shouldAddExportSuccessNotification) {
    const downloadURL = window.URL.createObjectURL(exportedManifestData);

    addSuccessNotification(`Manifest ${exportedManifestName} exported`, {
      hasTimeout: false,
      alertLinkHref: downloadURL,
      alertLinkText: 'Download manifest',
      alertLinkIsDownload: true,
      keyOfAlertToReplace: loadingManifestNotificationKey
    });
    setLoadingManifestNotificationKey('');
    setShouldAddExportSuccessNotification(false);
  }

  if (errorExportingManifest && shouldAddExportSuccessNotification) {
    addErrorNotification('Something went wrong. Please refresh the page and try again.', {
      hasTimeout: false,
      keyOfAlertToReplace: loadingManifestNotificationKey
    });
    setLoadingManifestNotificationKey('');
    setShouldAddExportSuccessNotification(false);
  }

  const actions = (uuid: string, name: string): IAction[] => {
    const results: IAction[] = [
      {
        title: 'Export',
        onClick: () => {
          exportManifest(uuid, name);
        },
        variant: 'link'
      },
      {
        title: 'Delete',
        isDisabled: !user.canWriteManifests,
        onClick: user.canWriteManifests
          ? () => {
              openDeleteConfirmationModal(uuid);
            }
          : null,
        variant: 'link'
      }
    ];
    return results;
  };
  const pagination = (variant = PaginationVariant.top) => {
    return (
      <Pagination
        isCompact={variant == PaginationVariant.top}
        isDisabled={isFetching}
        itemCount={countManifests(data, searchValue)}
        perPage={perPage}
        page={page}
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
        variant={variant}
      />
    );
  };

  const panelContent = () => {
    if (currentDetailUUID) {
      return (
        <ManifestDetailSidePanel
          uuid={currentDetailUUID}
          exportManifest={exportManifest}
          exportManifestButtonIsDisabled={isLoadingManifestExport}
          onCloseClick={closeDetailsPanel}
          isExpanded={detailsDrawerIsExpanded}
          titleRef={titleRef}
          drawerRef={drawerRef}
          openCurrentEntitlementsListFromPanel={openCurrentEntitlementsListFromPanel}
          deleteManifest={openDeleteConfirmationModal}
        />
      );
    } else {
      return '';
    }
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortBy.index,
      direction: sortBy.direction,
      defaultDirection: SortByDirection.asc
    },
    onSort: handleSort,
    columnIndex
  });

  const getRows = () => {
    if (isFetching) {
      return [];
    } else {
      return getRowsWithAllocationDetails(
        data,
        user,
        searchValue,
        page,
        perPage,
        rowExpandedStatus,
        handleRowManifestClick,
        entitlementsRowRefs,
        sortKeys[sortBy.index],
        sortBy.direction
      );
    }
  };

  return (
    <>
      {data?.length === 0 && user.canWriteManifests && <CreateManifestPanel user={user} />}
      {(data?.length > 0 || !user.canWriteManifests) && (
        <Drawer isExpanded={detailsDrawerIsExpanded} className="sub-c-drawer-satellite-manifest">
          <DrawerContent panelContent={panelContent()}>
            <DrawerContentBody>
              <PageSection hasBodyWrapper={false}>
                <Flex
                  direction={{ default: 'column', md: 'row' }}
                  justifyContent={{ default: 'justifyContentSpaceBetween' }}
                >
                  <FlexItem>
                    <Split hasGutter>
                      {data.length > 0 && (
                        <SplitItem isFilled>
                          <SearchInput
                            placeholder="Filter by name, version or UUID"
                            value={searchValue}
                            onChange={handleSearch}
                            onClear={clearSearch}
                          />
                        </SplitItem>
                      )}
                      <SplitItem>
                        <CreateManifestButtonWithModal user={user} />
                      </SplitItem>
                    </Split>
                  </FlexItem>
                  <FlexItem align={{ default: 'alignRight' }}>{pagination()}</FlexItem>
                </Flex>
              </PageSection>
              <Table
                aria-label="Satellite Manifest Table"
                variant="compact"
                ouiaId="manifestTable"
                ouiaSafe={true}
              >
                <Thead>
                  <Tr ouiaId="manifestTable/head" ouiaSafe={true}>
                    <Th />
                    {getTableHeaders(user).map((header, index) => {
                      sortKeys.push(header.sortKey);
                      return (
                        <Th key={index} sort={getSortParams(index)}>
                          {header.label}
                        </Th>
                      );
                    })}
                    <Td />
                  </Tr>
                </Thead>
                {getRows().map((row, index) => {
                  const manifest = row.cells;
                  const colSpan = sortKeys.length + 2; // +2 for expansion toggle and kabob menu
                  return (
                    <Tbody key={index} isExpanded={row.isOpen}>
                      <Tr ouiaId={`manifestTable/row${index}`} ouiaSafe={true}>
                        <Td
                          expand={{
                            rowIndex: index,
                            isExpanded: row.isOpen,
                            onToggle: () => toggleAllocationDetails(manifest.uuid)
                          }}
                        />
                        <Td>
                          <Button
                            data-testid={`expand-details-button-${index}`}
                            variant="link"
                            onClick={() => handleRowManifestClick(manifest.uuid, index)}
                          >
                            {manifest.name}
                          </Button>
                        </Td>
                        <Td>{manifest.version}</Td>
                        {user.isSCACapable && (
                          <Td>
                            <SCAStatusSwitch
                              scaStatus={manifest.scaStatus}
                              uuid={manifest.uuid}
                              user={user}
                            />
                          </Td>
                        )}
                        <Td>{manifest.uuid}</Td>
                        <Td>
                          <ActionsColumn items={actions(manifest.uuid, manifest.name)} />
                        </Td>
                      </Tr>
                      <Tr
                        isExpanded={row.isOpen}
                        ouiaId={`manifestTable/details${index}`}
                        ouiaSafe={true}
                      >
                        <Td colSpan={colSpan}>
                          <ExpandableRowContent>{row.details.content}</ExpandableRowContent>
                        </Td>
                      </Tr>
                    </Tbody>
                  );
                })}
              </Table>
              <PageSection hasBodyWrapper={false}>
                {countManifests(data, searchValue) === 0 && data.length > 0 && (
                  <NoSearchResults clearFilters={clearSearch} />
                )}
                {!isFetching && data.length === 0 && <CreateManifestPanel user={user} />}
                {isFetching && <Processing />}
                {pagination(PaginationVariant.bottom)}
              </PageSection>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}
      <DeleteManifestConfirmationModal
        uuid={currentDeletionUUID}
        name={currentDeletionName}
        isOpen={isDeleteManifestConfirmationModalOpen}
        handleModalToggle={handleDeleteManifestConfirmationModalToggle}
        onSuccess={closeDetailsPanel}
      />
    </>
  );
};
export default SatelliteManifestPanel;
