import React, { FunctionComponent } from 'react';
import { Button, Checkbox, List, ListItem, Modal, ModalVariant } from '@patternfly/react-core';
import useDeleteSatelliteManifest from '../../hooks/useDeleteSatelliteManifest';
import { Processing } from '../emptyState';

interface DeleteConfirmationModalProps {
  handleModalToggle: () => void;
  isOpen: boolean;
  name: string;
  uuid: string;
}

const DeleteConfirmationModal: FunctionComponent<DeleteConfirmationModalProps> = ({
  handleModalToggle,
  isOpen,
  name,
  uuid
}) => {
  const [checked, setChecked] = React.useState(false);
  const { isLoading: isDeletingManifest, mutate: deleteManifest } = useDeleteSatelliteManifest();

  const handleCheckbox = (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const closeModal = () => {
    handleModalToggle();
    setChecked(false);
  };

  const handleConfirmation = () => {
    deleteManifest(uuid);
    closeModal();
  };

  const actions = () => {
    if (isDeletingManifest) {
      return [];
    } else {
      return [
        <Button key="cancel" variant="link" onClick={closeModal}>
          NO, CANCEL
        </Button>,
        <Button key="confirm" variant="primary" isDisabled={!checked} onClick={handleConfirmation}>
          YES, DELETE
        </Button>
      ];
    }
  };

  const content = () => {
    if (isDeletingManifest) {
      return <Processing />;
    } else {
      return (
        <>
          <p>Deleting a manifest is STRONGLY discouraged. Deleting a manifest will:</p>
          <List>
            <ListItem>Delete all subscriptions that are attached to running hosts.</ListItem>
            <ListItem>Delete all subscriptions attached to activation keys.</ListItem>
            <ListItem>Disable Red Hat Insights.</ListItem>
            <ListItem>
              Require you to upload the manifest and re-attach subscriptions to hosts and activation
              keys.
            </ListItem>
          </List>
          <p>
            <strong>Caution: This operation is permanent and cannot be undone!</strong>
          </p>
          <Checkbox
            label="Are you sure you want to delete this manifest?"
            isChecked={checked}
            id="confirmation_checkbox"
            onChange={handleCheckbox}
          />
        </>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen || isDeletingManifest}
      onClose={closeModal}
      title={`Delete ${name}`}
      variant={ModalVariant.small}
      className="manifests"
      titleIconVariant="warning"
      actions={actions()}
      style={{ overflow: 'visible' }}
    >
      {content()}
    </Modal>
  );
};

export default DeleteConfirmationModal;
