import React, { FC, useState } from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';
import CreateManifestForm from '../CreateManifestForm/CreateManifestForm';
import { CreateManifestFormError, CreateManifestFormLoading } from '../CreateManifestForm';

const CreateManifestButtonWithModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useSatelliteVersions();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Button variant="primary" onClick={handleModalToggle}>
        Create new manifest
      </Button>
      <Modal variant={ModalVariant.medium} isOpen={isModalOpen} onClose={handleModalToggle}>
        {isLoading && <CreateManifestFormLoading title="Loading..." />}
        {isError && <CreateManifestFormError />}
        {!isLoading && !isError && (
          <CreateManifestForm
            satelliteVersions={data?.body}
            handleModalToggle={handleModalToggle}
            isModalOpen={isModalOpen}
          />
        )}
      </Modal>
    </>
  );
};

export default CreateManifestButtonWithModal;
