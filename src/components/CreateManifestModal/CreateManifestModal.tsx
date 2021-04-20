import React, { FC } from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
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
    isError: hasSatelliteVersionsError
  } = useSatelliteVersions();

  const {
    data: createManifestResponseData,
    mutate,
    isLoading: isCreatingManifest,
    isSuccess
  } = useCreateSatelliteManifest();

  const submitForm = (name: string, version: string) => {
    mutate({ name, version });
  };

  /**
   * In case of an error, the API will "succeed",
   * but with an error status, so we need to
   * check for data to confirm success
   */

  const hasCreatedManifest = typeof createManifestResponseData !== 'undefined';
  const errorCreatingManifest = isSuccess && !hasCreatedManifest;

  const formHasError = errorCreatingManifest || hasSatelliteVersionsError;

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
    </>
  );
};

export default CreateManifestModal;
