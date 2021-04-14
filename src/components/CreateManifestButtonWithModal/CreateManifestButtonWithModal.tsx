import React, { FC, useState } from 'react';
import {
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  Popover,
  Button,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import useSatelliteVersions, { SatelliteVersion } from '../../hooks/useSatelliteVersions';
import { useCreateSatelliteManifest } from '../../hooks/useCreateSatelliteManifest';

const CreateManifestButtonWithModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [version, setVersion] = useState('Select type');

  const { data } = useSatelliteVersions();
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
        variant={ModalVariant.medium}
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
        <p style={{ marginBottom: '30px' }}>
          Creating a new manifest allows you to export subscriptions to your on-premise subscription
          management application.
        </p>
        <Form isWidthLimited>
          <FormGroup
            style={{ margin: '30px 0;' }}
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
              placeholder="Name"
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
            <FormSelect
              value={version}
              onChange={handleSelectChange}
              aria-label="FormSelect Input"
              style={{ marginBottom: '30px' }}
            >
              <FormSelectOption
                isDisabled={true}
                key="select version"
                value="Select type"
                label="Select type"
              />
              {data?.body.map((satelliteVersion: SatelliteVersion) => {
                const satelliteVersionName = satelliteVersion.value.replace('sat-', 'Satellite ');
                return (
                  <FormSelectOption
                    isDisabled={false}
                    key={satelliteVersion.value}
                    value={satelliteVersion.value}
                    label={satelliteVersionName}
                  />
                );
              })}
            </FormSelect>
          </FormGroup>
        </Form>
      </Modal>
    </>
  );
};

export default CreateManifestButtonWithModal;
