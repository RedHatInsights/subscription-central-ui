import React, { FC, useState } from 'react';
import { Button } from '@patternfly/react-core';
import CreateManifestModal from '../CreateManifestModal';

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
      <CreateManifestModal handleModalToggle={handleModalToggle} isModalOpen={isModalOpen} />
    </>
  );
};

export default CreateManifestButtonWithModal;
