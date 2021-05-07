import React, { FC, useRef, useEffect } from 'react';
import { Table, TableHeader, TableBody, nowrap } from '@patternfly/react-table';
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
  const listTableRef = useRef(null);

  useEffect(() => {
    listTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    listTableRef.current.focus({ preventScroll: true });
  }, [isSuccess]);

  const columns = [
    {
      title: 'Subscription name',
      transforms: [nowrap]
    },
    {
      title: 'SKU',
      transforms: [nowrap]
    },
    {
      title: 'Contract number',
      transforms: [nowrap]
    },
    {
      title: 'Quantity',
      transforms: [nowrap]
    },
    {
      title: 'Start date',
      transforms: [nowrap]
    },
    {
      title: 'End date',
      transforms: [nowrap]
    }
  ];

  const getFormattedDate = (date: string) => {
    if (!date) return '';
    const year = date.substr(0, 4);
    const month = date.substr(5, 2);
    const day = date.substr(8, 2);
    return `${year}-${month}-${day}`;
  };

  type ManifestEntitlementListRow = [
    string | React.ReactNode,
    string,
    string,
    number,
    string,
    string
  ];
  let rows = [] as ManifestEntitlementListRow[];

  if (entitlementsData?.value) {
    rows = entitlementsData?.value.map(
      (entitlement: ManifestEntitlement, index): ManifestEntitlementListRow => {
        const formattedStartDate = getFormattedDate(entitlement.startDate);
        const formattedEndDate = getFormattedDate(entitlement.endDate);
        let subscriptionName: string | React.ReactNode = entitlement.subscriptionName;

        if (index === 0) {
          subscriptionName = (
            <>
              <span tabIndex={0} ref={listTableRef}>
                {entitlement.subscriptionName}
              </span>
            </>
          );
        }
        return [
          subscriptionName,
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
          <p tabIndex={isSuccess ? 0 : -1} ref={listTableRef}>
            {entitlementsData.reason}
          </p>
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
