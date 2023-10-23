import React, { FC, useState } from 'react';
import { Button } from '@patternfly/react-core';
import CreateManifestModal from '../CreateManifestModal';
import { User } from '../../hooks/useUser';
import { Tooltip } from '@patternfly/react-core';

interface CreateManifestButtonWithModalProps {
  user: User;
}

const CreateManifestButtonWithModal: FC<CreateManifestButtonWithModalProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const createButton = (
    <Button
      variant="primary"
      onClick={handleModalToggle}
      isDisabled={!user.canWriteManifests || !user.isEntitled}
    >
      Create new manifest
    </Button>
  );

  return (
    <>
      {user.isEntitled ? (
        createButton
      ) : (
        <Tooltip content="Your account has no Satellite subscriptions" trigger="mouseenter">
          <div>{createButton}</div>
        </Tooltip>
      )}
      <CreateManifestModal handleModalToggle={handleModalToggle} isModalOpen={isModalOpen} />
    </>
  );
};

export default CreateManifestButtonWithModal;
