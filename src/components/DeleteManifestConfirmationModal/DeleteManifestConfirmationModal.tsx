import React, { FunctionComponent } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Checkbox } from '@patternfly/react-core/dist/dynamic/components/Checkbox';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import useDeleteSatelliteManifest from '../../hooks/useDeleteSatelliteManifest';
import useNotifications from '../../hooks/useNotifications';

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
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const {
    isError: manifestFailedToDelete,
    isLoading: isDeletingManifest,
    isSuccess: manifestDeleted,
    mutate: deleteManifest,
    reset: resetRequestStatus
  } = useDeleteSatelliteManifest();
  const requestCompleted = manifestDeleted || manifestFailedToDelete;

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <Button
          key="confirm"
          variant="danger"
          isDisabled={!checked}
          onClick={() => deleteManifest(uuid)}
        >
          Delete
        </Button>,
        <Button key="cancel" variant="link" onClick={closeModal}>
          Cancel
        </Button>
      ];
    }
  };

  const ModalContent = () => {
    if (isDeletingManifest) {
      return <EmptyState icon={Spinner}></EmptyState>;
    } else {
      return (
        <>
          <Content component={ContentVariants.p}>
            <b>{name}</b> will be permanently deleted, and the connection to Red Hat Insights will
            be broken. To enable again, you must create, export, download, and import a new manifest
            into your connected Satellite Server.
          </Content>
          <Checkbox
            label="I acknowledge that this action cannot be undone"
            isChecked={checked}
            id="confirmation_checkbox"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCheckbox(event)}
          />
        </>
      );
    }
  };

  if (manifestDeleted) {
    onSuccess();
    addSuccessNotification(`Manifest ${name} deleted`);
  } else if (manifestFailedToDelete) {
    addErrorNotification('Something went wrong. Please try again');
  }
  if (requestCompleted) resetModal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isDeletingManifest ? `Deleting manifest...` : `Delete manifest?`}
      variant={ModalVariant.small}
      titleIconVariant="warning"
      actions={actions()}
    >
      <ModalContent />
    </Modal>
  );
};

export default DeleteManifestConfirmationModal;
