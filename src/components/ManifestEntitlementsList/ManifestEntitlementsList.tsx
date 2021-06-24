import React, { FC, useEffect } from 'react';
import { Table, TableHeader, TableBody, nowrap } from '@patternfly/react-table';
import { Processing } from '../emptyState';
import './ManifestEntitlementsList.scss';
import { EntitlementsAttachedData, ManifestEntitlement } from '../../hooks/useManifestEntitlements';

interface ManifestEntitlementsListProps {
  entitlementsData: EntitlementsAttachedData;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  entitlementsRowRef: React.MutableRefObject<any>;
}

const ManifestEntitlementsList: FC<ManifestEntitlementsListProps> = ({
  entitlementsData,
  isLoading,
  isSuccess,
  isError,
  entitlementsRowRef
}) => {
  useEffect(() => {
    if (entitlementsRowRef?.current) {
      entitlementsRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      entitlementsRowRef.current.focus({ preventScroll: true });
    }
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
      (entitlement: ManifestEntitlement): ManifestEntitlementListRow => {
        const formattedStartDate = getFormattedDate(entitlement.startDate);
        const formattedEndDate = getFormattedDate(entitlement.endDate);

        return [
          entitlement.subscriptionName,
          entitlement.sku,
          entitlement.contractNumber,
          entitlement.entitlementQuantity,
          formattedStartDate,
          formattedEndDate
        ];
      }
    );
  }

  return (
    <>
      {isLoading && !isError && (
        <div className="entitlement-list-loading-container">
          <Processing />
        </div>
      )}
      {isSuccess && !entitlementsData.valid && (
        <div className="no-entitlements-reason">
          <p tabIndex={isSuccess ? 0 : -1} ref={entitlementsRowRef}>
            {entitlementsData.reason}
          </p>
        </div>
      )}
      {isSuccess && entitlementsData.valid && (
        <div ref={entitlementsRowRef}>
          <Table
            aria-label="Allocations table"
            cells={columns}
            rows={rows}
            borders={false}
            className="manifests_entitlement-list-table"
          >
            <TableHeader />
            <TableBody />
          </Table>
        </div>
      )}
      {isError && 'Something went wrong.  Please refresh the page and try again.'}
    </>
  );
};

export default ManifestEntitlementsList;
