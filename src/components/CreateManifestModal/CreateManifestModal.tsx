import React, { FC, useEffect, useState } from 'react';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import {
  Alert,
  AlertActionCloseButton
} from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertGroup } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertVariant } from '@patternfly/react-core/dist/dynamic/components/Alert';
import CreateManifestForm from '../CreateManifestForm/CreateManifestForm';
import CreateManifestFormLoading from '../CreateManifestForm/CreateManifestFormLoading';
import useCreateSatelliteManifest from '../../hooks/useCreateSatelliteManifest';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';
import { NoSatelliteSubsToast } from '../NoSatelliteSubsToast/NoSatelliteSubsToast';

interface CreateManifestModalProps {
  handleModalToggle: () => void;
  isModalOpen: boolean;
}

interface AlertItem {
  key: number;
  content: React.ReactNode;
}

const CreateManifestModal: FC<CreateManifestModalProps> = ({ handleModalToggle, isModalOpen }) => {
  const {
    data,
    isLoading: isLoadingSatelliteVersions,
    isError: hasSatelliteVersionsError
  } = useSatelliteVersions();

  const {
    data: createManifestResponseData,
    mutate,
    isLoading: isCreatingManifest,
    isSuccess,
    isError: errorCreatingManifest,
    reset: resetCreateSatelliteManifestQuery,
    error: createManifestError
  } = useCreateSatelliteManifest();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = (content: React.ReactNode) => {
    setAlerts((prev) => [...prev, { key: Date.now(), content }]);
  };

  const removeAlert = (key: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.key !== key));
  };

  const submitForm = (name: string, version: string) => {
    mutate({ name, version });
  };

  if (isModalOpen && createManifestResponseData) {
    resetCreateSatelliteManifestQuery();
  }

  const hasCreatedManifest = typeof createManifestResponseData !== 'undefined';
  const formHasError = errorCreatingManifest || hasSatelliteVersionsError;

  useEffect(() => {
    if (errorCreatingManifest && createManifestError) {
      addAlert(<NoSatelliteSubsToast />);
      handleModalToggle();
    } else if (errorCreatingManifest || hasSatelliteVersionsError) {
      addAlert('An error occurred while creating the manifest.');
      handleModalToggle();
    }
  }, [errorCreatingManifest, hasSatelliteVersionsError, createManifestError]);

  return (
    <>
      <Modal
        aria-label="Create satellite manifest"
        variant={ModalVariant.medium}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        {isLoadingSatelliteVersions && <CreateManifestFormLoading title="Loading..." />}
        {!isLoadingSatelliteVersions && (
          <CreateManifestForm
            satelliteVersions={data?.body}
            submitForm={submitForm}
            isLoading={isCreatingManifest}
            isError={formHasError}
            isSuccess={hasCreatedManifest}
            handleModalToggle={handleModalToggle}
          />
        )}
      </Modal>

      <AlertGroup isToast>
        {alerts.map(({ key, content }) => (
          <Alert
            title=""
            key={key}
            variant={AlertVariant.danger}
            timeout={4000}
            actionClose={<AlertActionCloseButton onClose={() => removeAlert(key)} />}
          >
            {content}
          </Alert>
        ))}
      </AlertGroup>
    </>
  );
};
export default CreateManifestModal;
