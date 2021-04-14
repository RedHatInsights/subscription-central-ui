import React, { FC, useState } from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';
import CreateManifestForm from './CreateManifestForm';

const CreateManifestButtonWithModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useSatelliteVersions();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Button variant="primary" onClick={handleModalToggle}>
        Create new manifest
      </Button>
      <Modal
        variant={ModalVariant.medium}
        title="Create new manifest"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <p style={{ marginBottom: '30px' }}>
          Creating a new manifest allows you to export subscriptions to your on-premise subscription
          management application.
        </p>
        <CreateManifestForm
          satelliteVersions={data?.body}
          handleModalToggle={handleModalToggle}
          isModalOpen={isModalOpen}
        />
      </Modal>
    </>
  );
};

export default CreateManifestButtonWithModal;
