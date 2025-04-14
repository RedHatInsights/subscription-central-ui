import React, { FC, useEffect } from 'react';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import CreateManifestForm from '../CreateManifestForm/CreateManifestForm';
import CreateManifestFormLoading from '../CreateManifestForm/CreateManifestFormLoading';
import useCreateSatelliteManifest from '../../hooks/useCreateSatelliteManifest';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';
import { supportLink } from '../../utilities/consts';
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
  const { addErrorNotification } = useNotifications();
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

  if (isModalOpen && createManifestResponseData) {
    resetCreateSatelliteManifestQuery();
  }

  const hasCreatedManifest = typeof createManifestResponseData !== 'undefined';
  useEffect(() => {
    const status = (createManifestError as any)?.status;

    if (errorCreatingManifest && status === 403) {
      addErrorNotification(
        'A Satellite subscription is required to create a manifest. Contact support to check if you need a new subscription.',
        {
          alertLinkText: 'Contact support',
          alertLinkHref: supportLink
        }
      );
      handleModalToggle();
    } else if (errorCreatingManifest || hasSatelliteVersionsError) {
      addErrorNotification('An error occurred while creating the manifest.');
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
