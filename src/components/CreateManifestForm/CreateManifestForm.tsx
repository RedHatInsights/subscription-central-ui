import React, { useState, FC } from 'react';
import {
  Button,
  ActionGroup,
  Form,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  FormGroup,
  TextInput,
  Title,
  Popover,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import CreateManifestFormError from './CreateManifestFormError';
import CreateManifestFormSuccess from './CreateManifestFormSuccess';
import { useCreateSatelliteManifest } from '../../hooks/useCreateSatelliteManifest';
import { SatelliteVersion } from '../../hooks/useSatelliteVersions';
import { Processing } from '../emptyState';

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  isModalOpen: boolean;
}

const CreateManifestForm: FC<CreateManifestFormProps> = ({
  satelliteVersions,
  handleModalToggle,
  isModalOpen
}) => {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('Select type');
  const [nameValidated, setNameValidated] = useState('noval');
  const [versionValidated, setVersionValidated] = useState('noval');

  const { mutate, isLoading, isError, isSuccess } = useCreateSatelliteManifest();

  const clearErrors = () => {
    setNameValidated('noval');
    setVersionValidated('noval');
  };

  const resetForm = () => {
    setName('');
    setVersion('Select type');
    setNameValidated('noval');
    setVersionValidated('noval');
  };

  const handleNameChange = (value: string) => {
    if (name.length) {
      setNameValidated('noval');
    }
    setName(value);
  };

  const handleSelectChange = (value: string) => {
    setVersionValidated('noval');
    setVersion(value);
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!name.length) {
      setNameValidated('error');
      isValid = false;
    }

    if (version === 'Select type') {
      setVersionValidated('error');
      isValid = false;
    }
    return isValid;
  };

  const handleFormSubmit = () => {
    const formIsValid = validateForm();
    if (!formIsValid) return;
    mutate({ name, version });
  };

  !isModalOpen && resetForm();

  const shouldShowForm = isLoading === false && isError === false && isSuccess === false;

  return (
    <>
      {shouldShowForm && (
        <>
          <Title headingLevel="h3" size="2xl">
            Create new manifest
          </Title>
          <p style={{ margin: '30px 0' }}>
            Creating a new manifest allows you to export subscriptions to your on-premise
            subscription management application.
          </p>
          <Form isWidthLimited>
            <FormGroup
              label="Name"
              helperTextInvalid="Please provide a name for your new manifest"
              validated={nameValidated}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
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
                aria-describedby="simple-form-name-01-helper"
                value={name}
                placeholder="Name"
                onChange={handleNameChange}
              />
            </FormGroup>
            <FormGroup
              label="Type"
              helperTextInvalid="Please select a version for your new manifest"
              validated={versionValidated}
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
                validated={versionValidated}
              >
                <FormSelectOption
                  isDisabled={true}
                  key="select version"
                  value="Select type"
                  label="Select type"
                />
                {satelliteVersions?.map((satelliteVersion: SatelliteVersion) => {
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
            <ActionGroup>
              <Button key="confirm" variant="primary" onClick={handleFormSubmit}>
                Save
              </Button>

              <Button key="cancel" variant="link" onClick={handleModalToggle}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </>
      )}
      {isLoading && (
        <EmptyState variant={EmptyStateVariant.small}>
          <Title headingLevel="h3">Creating manifest....</Title>
          <EmptyStateBody>
            <Processing />
          </EmptyStateBody>
        </EmptyState>
      )}
      {isSuccess && (
        <CreateManifestFormSuccess handleModalToggle={handleModalToggle} manifestName={name} />
      )}
      {isError && <CreateManifestFormError />}
    </>
  );
};

export default CreateManifestForm;
