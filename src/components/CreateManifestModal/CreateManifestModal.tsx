import React, { FC, useEffect } from 'react';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import CreateManifestForm from '../CreateManifestForm/CreateManifestForm';
import CreateManifestFormLoading from '../CreateManifestForm/CreateManifestFormLoading';
import useCreateSatelliteManifest from '../../hooks/useCreateSatelliteManifest';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';

interface CreateManifestModalProps {
  handleModalToggle: () => void;
  isModalOpen: boolean;
}
const CreateManifestModal: FC<CreateManifestModalProps> = ({ handleModalToggle, isModalOpen }) => {
  const {
    data,
    isLoading: isLoadingSatelliteVersions,
    error: satelliteVersionsError,
    refetch: refetchSatelliteVersions
  } = useSatelliteVersions();
  const {
    mutate,
    isLoading: isCreatingManifest,
    isSuccess,
    reset: resetCreateSatelliteManifestQuery,
    error: createManifestError
  } = useCreateSatelliteManifest();

  const submitForm = (name: string, version: string) => {
    mutate({ name, version });
  };

  useEffect(() => {
    if (!isModalOpen) {
      refetchSatelliteVersions();
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
            isLoading={isCreatingManifest || isLoadingSatelliteVersions}
            error={satelliteVersionsError ?? createManifestError}
            isSuccess={isSuccess}
            handleModalToggle={() => {
              handleModalToggle();
              resetCreateSatelliteManifestQuery();
            }}
          />
        )}
      </Modal>
    </>
  );
};
export default CreateManifestModal;
