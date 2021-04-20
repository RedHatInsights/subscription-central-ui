import React, { useState, FC } from 'react';
import {
  Button,
  ActionGroup,
  Form,
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
import CreateManifestFormLoading from './CreateManifestFormLoading';
import CreateManifestFormSuccess from './CreateManifestFormSuccess';
import { SatelliteVersion } from '../../hooks/useSatelliteVersions';

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  submitForm: (name: string, version: string) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const CreateManifestForm: FC<CreateManifestFormProps> = (props) => {
  const { satelliteVersions, handleModalToggle, submitForm, isLoading, isError, isSuccess } = props;

  const [name, setName] = useState('');
  const [version, setVersion] = useState('Select type');
  const [nameValidated, setNameValidated] = useState('noval');
  const [nameHasInvalidCharacters, setNameHasInvalidCharacters] = useState(false);
  const [versionValidated, setVersionValidated] = useState('noval');

  const clearErrors = () => {
    setNameValidated('noval');
    setVersionValidated('noval');
    setNameHasInvalidCharacters(false);
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

  const validateManifestName = (name: string) => {
    if (name.length >= 100) {
      return false;
    }
    if (name.length === 0) {
      return true;
    }

    const regExp = new RegExp('^[0-9A-Za-z_.-]+$');
    const result = regExp.test(name);
    return regExp.test(name);
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!name.length) {
      setNameValidated('error');
      isValid = false;
    }
    if (validateManifestName(name) === false) {
      setNameValidated('error');
      setNameHasInvalidCharacters(true);
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
    submitForm(name, version);
  };

  const nameHelperTextInvalid = nameHasInvalidCharacters
    ? `Your manifest name must be less than 100 characters and use only numbers, letters,
       underscores, hyphens, and periods.`
    : 'Please provide a name for your new manifest';

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
              helperTextInvalid={nameHelperTextInvalid}
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
                    aria-describedby="create-satellite-manifest-form-name"
                    className="pf-c-form__group-label-help"
                  >
                    <HelpIcon noVerticalAlign />
                  </button>
                </Popover>
              }
              isRequired
              fieldId="create-satellite-manifest-form-name"
            >
              <TextInput
                isRequired
                type="text"
                id="create-satellite-manifest-form-name"
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
                    aria-describedby="create-satellite-manifest-form-type"
                  >
                    <HelpIcon noVerticalAlign />
                  </button>
                </Popover>
              }
              isRequired
              fieldId="create-satellite-manifest-form-type"
            >
              <FormSelect
                value={version}
                onChange={handleSelectChange}
                aria-label="FormSelect Input"
                validated={versionValidated}
                id="create-satellite-manifest-form-type"
              >
                <FormSelectOption
                  isDisabled={true}
                  key="select version"
                  value="Select type"
                  label="Select type"
                />
                {satelliteVersions?.map((satelliteVersion: SatelliteVersion) => {
                  return (
                    <FormSelectOption
                      isDisabled={false}
                      key={satelliteVersion.value}
                      value={satelliteVersion.value}
                      label={satelliteVersion.description}
                    />
                  );
                })}
              </FormSelect>
            </FormGroup>
            <ActionGroup>
              <Button
                key="confirm"
                id="save-manifest-button"
                variant="primary"
                onClick={handleFormSubmit}
              >
                Save
              </Button>

              <Button
                key="cancel"
                id="cancel-create-manifest-button"
                variant="link"
                onClick={handleModalToggle}
              >
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </>
      )}
      {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
      {isSuccess && (
        <CreateManifestFormSuccess handleModalToggle={handleModalToggle} manifestName={name} />
      )}
      {isError && <CreateManifestFormError />}
    </>
  );
};

export default CreateManifestForm;
