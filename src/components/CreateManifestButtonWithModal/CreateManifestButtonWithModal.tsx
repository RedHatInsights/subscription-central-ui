import React, { FC, useState } from 'react';
import {
  Modal,
  Form,
  FormGroup,
  TextInput,
  Popover,
  Button,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import { useCreateSatelliteManifest } from '../../hooks/useCreateSatelliteManifest';

const CreateManifestButtonWithModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [version, setVersion] = useState('Select type');
  const manifestTypeSelectOptions = [
    {
      value: 'Select type',
      label: 'Select type',
      disabled: true
    },
    { value: '6.5', label: '6.5', disabled: false }
  ];

  const mutation = useCreateSatelliteManifest();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleSelectChange = (value: string) => {
    setVersion(value);
  };

  const handleFormSubmit = () => {
    mutation.mutate({ name, version });
  };

  return (
    <>
      <Button variant="primary" onClick={handleModalToggle}>
        Create new manifest
      </Button>
      <Modal
        width={'50%'}
        title="Create new manifest"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Creating a new manifest allows you to export subscriptions to your on-premise subscription
        management application.
        <Form isWidthLimited>
          <FormGroup
            label="Name"
            labelIcon={
              <Popover
                bodyContent={
                  <div>
                    Provide a name that will help you associate this manifest with a specific
                    organization or on-premise subscription management application.
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label="More info for name field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="simple-form-name-01"
                  className="pf-c-form__group-label-help"
                >
                  <HelpIcon noVerticalAlign />
                </button>
              </Popover>
            }
            isRequired
            fieldId="simple-form-name-01"
          >
            <TextInput
              isRequired
              type="text"
              id="simple-form-name-01"
              name="simple-form-name-01"
              aria-describedby="simple-form-name-01-helper"
              value={name}
              onChange={handleNameChange}
            />
          </FormGroup>
          <FormGroup
            label="Type"
            labelIcon={
              <Popover
                bodyContent={
                  <div>
                    Due to variation in supported features, it is important to match the type and
                    version of the subscription management application you are using.
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label="More info for type field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="simple-form-name-01"
                  className="pf-c-form__group-label-help"
                >
                  <HelpIcon noVerticalAlign />
                </button>
              </Popover>
            }
            isRequired
            fieldId="simple-form-name-01"
          >
            <FormSelect value={version} onChange={handleSelectChange} aria-label="FormSelect Input">
              {manifestTypeSelectOptions.map((option, index) => (
                <FormSelectOption
                  isDisabled={option.disabled}
                  key={index}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </FormSelect>
          </FormGroup>
        </Form>
      </Modal>
    </>
  );
};

export default CreateManifestButtonWithModal;
