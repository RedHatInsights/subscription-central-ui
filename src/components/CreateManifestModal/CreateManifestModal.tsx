import React, { FC, useEffect } from 'react';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import CreateManifestForm from '../CreateManifestForm/CreateManifestForm';
import CreateManifestFormLoading from '../CreateManifestForm/CreateManifestFormLoading';
import useCreateSatelliteManifest from '../../hooks/useCreateSatelliteManifest';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';
import { NoSatelliteSubsToast } from '../NoSatelliteSubsToast/NoSatelliteSubsToast';
import useNotifications from '../../hooks/useNotifications';
interface CreateManifestModalProps {
  handleModalToggle: () => void;
  isModalOpen: boolean;
}
const CreateManifestModal: FC<CreateManifestModalProps> = ({ handleModalToggle, isModalOpen }) => {
  const {
    data,
    isLoading: isLoadingSatelliteVersions,
    isError: hasSatelliteVersionsError
  } = useSatelliteVersions();
  const { addErrorNotification, removeNotification } = useNotifications();
  const {
    data: createManifestResponseData,
    mutate,
    isLoading: isCreatingManifest,
    isSuccess,
    isError: errorCreatingManifest,
    reset: resetCreateSatelliteManifestQuery,
    error: createManifestError
  } = useCreateSatelliteManifest();
  const submitForm = (name: string, version: string) => {
    mutate({ name, version });
  };
  const key = 'no-sat-toast';
  const hasCreatedManifest = typeof createManifestResponseData !== 'undefined';
  useEffect(() => {
    if (errorCreatingManifest && createManifestError) {
      addErrorNotification(
        <NoSatelliteSubsToast
          onClose={() => {
            removeNotification(key);
            handleModalToggle();
          }}
        />
      );
      handleModalToggle();
    } else if (errorCreatingManifest || hasSatelliteVersionsError) {
      addErrorNotification('An error occurred while creating the manifest.');
      handleModalToggle();
    }
  }, [errorCreatingManifest, hasSatelliteVersionsError, createManifestError]);
  useEffect(() => {
    if (!isModalOpen) {
      resetCreateSatelliteManifestQuery();
    }
  }, [isModalOpen]);
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
            isError={!!(errorCreatingManifest || hasSatelliteVersionsError)}
            isSuccess={hasCreatedManifest}
            handleModalToggle={handleModalToggle}
          />
        )}
      </Modal>
    </>
  );
};
export default CreateManifestModal;
