import React, { FC } from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Processing } from '../emptyState';
import './ManifestEntitlementsList.scss';

interface ManifestEntitlementsListProps {
  entitlementsData: any;
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

  let rows = [];

  if (entitlementsData?.value) {
    rows = entitlementsData?.value.map((entitlement: any) => {
      const formattedStartDate = getFormattedDate(entitlementsData.startDate);
      const formattedEndDate = getFormattedDate(entitlementsData.endDate);
      return [
        entitlement.subscriptionName || '',
        entitlement.sku,
        entitlement.contractNumber,
        entitlement.entitlementQuantity,
        formattedStartDate || '',
        formattedEndDate || ''
      ];
    });
  }

  const actions = [
    {
      title: 'Remove Subscription',
      onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
        console.log('clicked on Some action, on row: ', rowId, rowData);
      }
    },
    {
      title: 'Move Subscription',
      onClick: (event: React.MouseEvent, rowId: number, rowData: any) => {
        console.log('clicked on Some action, on row: ', rowId, rowData);
      }
    }
  ];

  return (
    <>
      {isLoading && (
        <div className="entitlement-list-loading-container">
          <Processing />
        </div>
      )}
      {isSuccess && !entitlementsData.valid && (
        <p className="no-entitlements-reason">{entitlementsData.reason}</p>
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
          <TableHeader className="manifest-entitlements-list-header" />
          <TableBody />
        </Table>
      )}
      {isError && 'Something went wrong.  Please refresh the page and try again.'}
    </>
  );
};

export default ManifestEntitlementsList;
