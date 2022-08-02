import React, { FC, useEffect } from 'react';
import { TableComposable, Tbody, Td, Th, Thead, Tr, nowrap } from '@patternfly/react-table';
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
        <div className="sub-entitlement-list-loading-container">
          <Processing />
        </div>
      )}
      {isSuccess && !entitlementsData.valid && (
        <div className="sub-no-entitlements-reason">
          <p tabIndex={isSuccess ? 0 : -1} ref={entitlementsRowRef}>
            {entitlementsData.reason}
          </p>
        </div>
      )}
      {isSuccess && entitlementsData.valid && (
        <React.Fragment>
          {/* @ts-ignore */}
          <TableComposable
            ref={entitlementsRowRef}
            aria-label="Allocations table"
            variant="compact"
            borders={false}
            isNested={true}
            // actions={actions}
            className="sub-c-table-manifests-entitlement-list"
          >
            <Thead>
              {/* @ts-ignore */}
              <Tr>
                <Th>Subscription name</Th>
                <Th>SKU</Th>
                <Th>Contract number</Th>
                <Th>Quantity</Th>
                <Th>Start date</Th>
                <Th>End date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, index) => (
                <React.Fragment key={index}>
                  {/* @ts-ignore */}
                  <Tr>
                    <Td>{row[0]}</Td>
                    <Td>{row[1]}</Td>
                    <Td>{row[2]}</Td>
                    <Td>{row[3]}</Td>
                    <Td>{row[4]}</Td>
                    <Td>{row[5]}</Td>
                  </Tr>
                </React.Fragment>
              ))}
            </Tbody>
          </TableComposable>
        </React.Fragment>
      )}
      {isError && 'Something went wrong.  Please refresh the page and try again.'}
    </>
  );
};

export default ManifestEntitlementsList;
