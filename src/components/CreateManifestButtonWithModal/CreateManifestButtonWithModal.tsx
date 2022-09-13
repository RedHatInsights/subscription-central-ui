import React, { FC, useState } from 'react';
import { Button } from '@patternfly/react-core';
import CreateManifestModal from '../CreateManifestModal';
import { User } from '../../hooks/useUser';

interface CreateManifestButtonWithModalProps {
  user: User;
}

const CreateManifestButtonWithModal: FC<CreateManifestButtonWithModalProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  console.log(user);
  return (
    <>
      <Button variant="primary" onClick={handleModalToggle} isDisabled={!user.canWriteManifests}>
        Create new manifest
      </Button>
      <CreateManifestModal handleModalToggle={handleModalToggle} isModalOpen={isModalOpen} />
    </>
  );
};

export default CreateManifestButtonWithModal;
