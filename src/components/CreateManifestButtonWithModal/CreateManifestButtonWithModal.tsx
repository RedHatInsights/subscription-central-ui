import React, { FC, useState } from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { CreateManifestFormContainer } from '../CreateManifestForm';

const CreateManifestButtonWithModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Button variant="primary" onClick={handleModalToggle}>
        Create new manifest
      </Button>
      <Modal
        aria-label="Create satellite manifest"
        variant={ModalVariant.medium}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <CreateManifestFormContainer handleModalToggle={handleModalToggle} />
      </Modal>
    </>
  );
};

export default CreateManifestButtonWithModal;
