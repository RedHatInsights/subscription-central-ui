import React, { FunctionComponent } from 'react';
import {
  Button,
  Checkbox,
  EmptyState,
  EmptyStateIcon,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Spinner,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import useDeleteSatelliteManifest from '../../hooks/useDeleteSatelliteManifest';

interface DeleteManifestConfirmationModalProps {
  handleModalToggle: () => void;
  onSuccess: () => void;
  isOpen: boolean;
  name: string;
  uuid: string;
}

const DeleteManifestConfirmationModal: FunctionComponent<DeleteManifestConfirmationModalProps> = ({
  handleModalToggle,
  onSuccess,
  isOpen,
  name,
  uuid
}) => {
  const [checked, setChecked] = React.useState(false);
  const {
    isError: manifestFailedToDelete,
    isLoading: isDeletingManifest,
    isSuccess: manifestDeleted,
    mutate: deleteManifest,
    reset: resetRequestStatus
  } = useDeleteSatelliteManifest();
  const requestCompleted = manifestDeleted || manifestFailedToDelete;

  const handleCheckbox = (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const closeModal = () => {
    handleModalToggle();
    setChecked(false);
  };

  const resetModal = () => {
    closeModal();
    resetRequestStatus();
  };

  const actions = () => {
    if (isDeletingManifest) {
      return [];
    } else {
      return [
        <Button key="cancel" variant="link" onClick={closeModal}>
          NO, CANCEL
        </Button>,
        <Button
          key="confirm"
          variant="danger"
          isDisabled={!checked}
          onClick={() => deleteManifest(uuid)}
        >
          YES, DELETE
        </Button>
      ];
    }
  };

  const content = () => {
    if (isDeletingManifest) {
      return (
        <EmptyState>
          <EmptyStateIcon variant="container" component={Spinner} />
        </EmptyState>
      );
    } else {
      return (
        <TextContent>
          <Text component={TextVariants.p}>
            Deleting a manifest is STRONGLY discouraged. Deleting a manifest will:
          </Text>
          <List>
            <ListItem>Delete all subscriptions that are attached to running hosts.</ListItem>
            <ListItem>Delete all subscriptions attached to activation keys.</ListItem>
            <ListItem>Disable Red Hat Insights.</ListItem>
            <ListItem>
              Require you to upload the manifest and re-attach subscriptions to hosts and activation
              keys.
            </ListItem>
          </List>
          <Text component={TextVariants.p}>
            <strong>Caution: this operation is permanent and cannot be undone.</strong>
          </Text>
          <Checkbox
            label="Are you sure you want to delete this manifest?"
            isChecked={checked}
            id="confirmation_checkbox"
            onChange={handleCheckbox}
          />
        </TextContent>
      );
    }
  };

  if (requestCompleted) resetModal();
  if (manifestDeleted) onSuccess();
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isDeletingManifest ? `Deleting ${name}...` : `Delete ${name}`}
      variant={ModalVariant.small}
      titleIconVariant="warning"
      actions={actions()}
    >
      {content()}
    </Modal>
  );
};

export default DeleteManifestConfirmationModal;
