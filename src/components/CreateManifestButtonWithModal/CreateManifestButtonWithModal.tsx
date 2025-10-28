import React, { FC, useState } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
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

  const createButton = (
    <Button variant="primary" onClick={handleModalToggle} isDisabled={!user.canWriteManifests}>
      Create new manifest
    </Button>
  );

  return (
    <>
      {createButton}
      <CreateManifestModal handleModalToggle={handleModalToggle} isModalOpen={isModalOpen} />
    </>
  );
};

export default CreateManifestButtonWithModal;
