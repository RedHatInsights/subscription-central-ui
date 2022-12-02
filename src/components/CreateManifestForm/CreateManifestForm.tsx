import React, { useState, FC } from 'react';
import {
  Button,
  ActionGroup,
  Form,
  FormGroup,
  TextInput,
  Title,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core';
import useNotifications from '../../hooks/useNotifications';
import useSatelliteVersions, { SatelliteVersion } from '../../hooks/useSatelliteVersions';
import CreateManifestFormLoading from './CreateManifestFormLoading';
import useCreateSatelliteManifest from '../../hooks/useCreateSatelliteManifest';

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  submitForm: (name: string, version: string) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const CreateManifestForm: FC<CreateManifestFormProps> = (props) => {
  const { isError: hasSatelliteVersionsError } = useSatelliteVersions();
  const { data: createManifestResponseData, isError: errorCreatingManifest } =
    useCreateSatelliteManifest();
  type Validate = 'default' | 'error' | 'success';
  const { satelliteVersions, handleModalToggle, isLoading, submitForm, isError, isSuccess } = props;
  const [inputFieldBlur, setinputFieldBlur] = React.useState(false);
  const [dropdownFieldBlur, setDropdownFieldBlur] = React.useState(false);
  const [manifestName, setManifestName] = useState('');
  const [manifestType, setManifestType] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [invalidTypeText, setInvalidTypeText] = React.useState('');
  const [nameValidated, setNameValidated] = React.useState<Validate>('default');
  const [typeValidated, setTypeValidated] = React.useState<Validate>('default');
  const [nameFieldHelperText, setNameFieldHelperText] = React.useState(
    'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
  );
  const [invalidNameFieldText, setInvalidNameFieldText] = React.useState(
    'Name requirements have not been met.Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
  );

  const onSubmit = (): void => {
    submitForm(manifestName, manifestType);
  };

  const shouldShowForm = isLoading === false && isError === false && isSuccess === false;

  if (isSuccess) {
    addSuccessNotification(`Manifest ${manifestName} created`);
    handleModalToggle();
  } else if (isError) {
    addErrorNotification('Something went wrong. Please try again');
    handleModalToggle();
  }

  const hasCreatedManifest = typeof createManifestResponseData !== 'undefined';

  const formHasError = errorCreatingManifest || hasSatelliteVersionsError;

  const satelliteTypeOptions = satelliteVersions?.map((satelliteVersion: SatelliteVersion) => {
    return (
      <FormSelectOption
        key={satelliteVersion.value}
        value={satelliteVersion.value}
        label={satelliteVersion.description}
        validated={typeValidated}
      />
    );
  });
  const isValidManifestName = (manifestName: string) => {
    if (
      /^[0-9A-Za-z_.-]*$/.test(manifestName) &&
      manifestName.length > 0 &&
      manifestName.length < 99
    ) {
      setNameFieldHelperText(nameFieldHelperText);
      setNameValidated('success');
    } else if (manifestName != '') {
      setNameValidated('error');
      setInvalidNameFieldText(invalidNameFieldText);
    } else if (manifestName == '' && inputFieldBlur) {
      setNameValidated('error');
      setInvalidNameFieldText(invalidNameFieldText);
    } else {
      setNameValidated('default');
    }
  };

  const isValidManifestType = (manifestType: string) => {
    if (manifestType != '') {
      setTypeValidated('success');
    } else if (manifestType == '' && dropdownFieldBlur) {
      setTypeValidated('error');
      setInvalidTypeText('Selection Required');
    } else if (manifestType == '' && inputFieldBlur) {
      setTypeValidated('error');
      setInvalidTypeText('Selection Required');
    } else {
      setTypeValidated('default');
    }
    return;
  };

  const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setinputFieldBlur(true);
  };

  const formSelectBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setDropdownFieldBlur(true);
  };

  const handleNameChange = (manifestName: string, e: React.FormEvent<HTMLInputElement>) => {
    setManifestName(manifestName);
  };

  const handleTypeChange = (value: string, _event: React.FormEvent<HTMLSelectElement>) => {
    setManifestType(value);
  };

  React.useEffect(() => {
    isValidManifestName(manifestName);
    isValidManifestType(manifestType);
  });

  const RenderForm = () => {
    return (
      <>
        <Title headingLevel="h3" size="2xl">
          Create manifest
        </Title>
        <p style={{ margin: '30px 0' }}>
          Creating a manifest allows you to export subscriptions to your on-premise subscription
          management application. Match the type and version of the subscription management
          application that you are using. All fields are required.
        </p>
        <Form isError={formHasError} isSuccess={hasCreatedManifest} isWidthLimited>
          <FormGroup
            label="Name"
            helperText={nameFieldHelperText}
            helperTextInvalid={invalidNameFieldText}
            validated={nameValidated}
            fieldId="create-satellite-manifest-form-name"
          >
            <TextInput
              name="satelliteManifestName"
              value={manifestName}
              onChange={handleNameChange}
              validated={nameValidated}
              id="create-satellite-manifest-form-name"
              onBlur={onBlurHandler}
            />
          </FormGroup>
          <FormGroup
            label="Type"
            helperTextInvalid={invalidTypeText}
            fieldId="create-satellite-manifest-form-type"
            validated={typeValidated}
          >
            <FormSelect
              value={manifestType}
              onChange={handleTypeChange}
              onBlur={formSelectBlurHandler}
              name="satelliteManifestType"
              aria-label="FormSelect Input"
              id="create-satellite-manifest-form-type"
              validated={typeValidated}
            >
              <FormSelectOption
                name="satelliteManifestType"
                value=""
                isDisabled
                isPlaceholder={true}
                key="Select type"
                label="Select type"
              />
              {satelliteTypeOptions}
            </FormSelect>
          </FormGroup>
          <ActionGroup>
            <Button
              type="submit"
              key="confirm"
              id="submit-manifest-button"
              variant="primary"
              onClick={onSubmit}
              isDisabled={nameValidated != 'success' || typeValidated != 'success'}
            >
              Create
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
    );
  };
  return (
    <>
      {shouldShowForm && RenderForm()}
      {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
    </>
  );
};
export default CreateManifestForm;
