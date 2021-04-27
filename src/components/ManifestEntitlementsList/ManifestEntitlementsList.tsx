import React, { FC } from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Processing } from '../emptyState';
import './ManifestEntitlementsList.scss';
import { EntitlementsAttachedData, ManifestEntitlement } from '../../hooks/useManifestEntitlements';

interface ManifestEntitlementsListProps {
  entitlementsData: EntitlementsAttachedData;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const ManifestEntitlementsList: FC<ManifestEntitlementsListProps> = ({
  entitlementsData,
  isLoading,
  isSuccess,
  isError
}) => {
  const columns = [
    'Subscription name',
    'SKU',
    'Contract number',
    'Quantity',
    'Start date',
    'End date'
  ];

  const getFormattedDate = (date: string) => {
    if (!date) return '';
    const year = date.substr(0, 4);
    const month = date.substr(5, 2);
    const day = date.substr(8, 2);
    return `${year}-${month}-${day}`;
  };

  type ManifestEntitlementListRow = [string, string, string, number, string, string];
  let rows = [] as ManifestEntitlementListRow[];

  if (entitlementsData?.value) {
    rows = entitlementsData?.value.map(
      (entitlement: ManifestEntitlement): ManifestEntitlementListRow => {
        const formattedStartDate = getFormattedDate(entitlement.startDate);
        const formattedEndDate = getFormattedDate(entitlement.endDate);

        return [
          entitlement.subscriptionName || '',
          entitlement.sku,
          entitlement.contractNumber,
          entitlement.entitlementQuantity,
          formattedStartDate,
          formattedEndDate
        ];
      }
    );
  }

  const actions = [
    {
      title: 'Remove Subscription',
      onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
        // placeholder for now
        console.log('clicked on Some action, on row: ', rowId, rowData);
      }
    },
    {
      title: 'Move Subscription',
      onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
        // placeholder for now
        console.log('clicked on Some action, on row: ', rowId, rowData);
      }
    }
  ];

  return (
    <>
      {isLoading && !isError && (
        <div className="entitlement-list-loading-container">
          <Processing />
        </div>
      )}
      {isSuccess && !entitlementsData.valid && (
        <div className="no-entitlements-reason">
          <p>{entitlementsData.reason}</p>
        </div>
      )}
      {isSuccess && entitlementsData.valid && (
        <Table
          aria-label="Allocations table"
          cells={columns}
          rows={rows}
          borders={false}
          actions={actions}
          className="manifests_entitlement-list-table"
        >
          <TableHeader />
          <TableBody />
        </Table>
      )}
      {isError && 'Something went wrong.  Please refresh the page and try again.'}
    </>
  );
};

export default ManifestEntitlementsList;
