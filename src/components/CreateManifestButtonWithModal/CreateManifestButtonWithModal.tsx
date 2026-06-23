import React, { useState } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Relation, useHasRelation } from '../../hooks/useHasRelation';
import CreateManifestModal from '../CreateManifestModal';

const CreateManifestButtonWithModal = () => {
  const { has: canWriteManifests } = useHasRelation(Relation.MANIFESTS_EDIT);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const createButton = (
    <Button variant="primary" onClick={handleModalToggle} isDisabled={!canWriteManifests}>
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
