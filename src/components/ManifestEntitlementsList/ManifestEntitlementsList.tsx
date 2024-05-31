import React, { FC, useEffect } from 'react';
import { Table /* data-codemods */, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Processing } from '../emptyState';
import './ManifestEntitlementsList.scss';
import useManifestEntitlements, { ManifestEntitlement } from '../../hooks/useManifestEntitlements';

interface ManifestEntitlementsListProps {
  entitlementsRowRef: React.MutableRefObject<any>;
  uuid: string;
}

type ManifestEntitlementListRow = {
  subscriptionName: string | React.ReactNode;
  sku: string;
  contractNumber: string;
  entitlementQuantity: number;
  startDate: string;
  endDate: string;
};

const ManifestEntitlementsList: FC<ManifestEntitlementsListProps> = ({
  entitlementsRowRef,
  uuid
}) => {
  const { isError, isSuccess, isLoading, data } = useManifestEntitlements(uuid);
  const entitlementsData = data?.body?.entitlementsAttached;

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

  let rows = [] as ManifestEntitlementListRow[];

  if (entitlementsData?.value) {
    rows = entitlementsData?.value.map(
      (entitlement: ManifestEntitlement): ManifestEntitlementListRow => {
        const formattedStartDate = getFormattedDate(entitlement.startDate);
        const formattedEndDate = getFormattedDate(entitlement.endDate);

        return {
          subscriptionName: entitlement.subscriptionName,
          sku: entitlement.sku,
          contractNumber: entitlement.contractNumber,
          entitlementQuantity: entitlement.entitlementQuantity,
          startDate: formattedStartDate,
          endDate: formattedEndDate
        };
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
        <Table
          ref={entitlementsRowRef}
          aria-label="Manifests table"
          variant="compact"
          borders={false}
          isNested={true}
          // actions={actions}
          className="sub-c-table-manifests-entitlement-list"
          ouiaId={`entitlementTable/${uuid}`}
          ouiaSafe={true}
        >
          <Thead>
            <Tr ouiaId={`entitlementTable/${uuid}/head`} ouiaSafe={true}>
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
              <Tr key={index} ouiaId={`entitlementTable/${uuid}/row${index}`} ouiaSafe={true}>
                <Td>{row.subscriptionName}</Td>
                <Td>{row.sku}</Td>
                <Td>{row.contractNumber}</Td>
                <Td>{row.entitlementQuantity}</Td>
                <Td>{row.startDate}</Td>
                <Td>{row.endDate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {isError && 'Something went wrong.  Please refresh the page and try again.'}
    </>
  );
};

export default ManifestEntitlementsList;
export { ManifestEntitlementsListProps };
