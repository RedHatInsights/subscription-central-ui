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
import { SatelliteVersion } from '../../hooks/useSatelliteVersions';
import CreateManifestFormLoading from './CreateManifestFormLoading';

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  submitForm: (name: string, version: string) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const CreateManifestForm: FC<CreateManifestFormProps> = (props) => {
  type Validate = 'default' | 'error' | 'success';
  const { satelliteVersions, handleModalToggle, isLoading, submitForm, isError, isSuccess } = props;
  const [manifestName, setManifestName] = useState('');
  const [manifestType, setManifestType] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [invalidNameFieldText, setInvalidNameFieldText] = React.useState('');
  const [invalidTypeText, setInvalidTypeText] = React.useState('');
  const [nameValidated, setNameValidated] = React.useState<Validate>('default');
  const [typeValidated, setTypeValidated] = React.useState<Validate>('default');
  const [nameFieldHelperText, setNameFieldHelperText] = React.useState(
    'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
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

  const satelliteTypeOptions = satelliteVersions?.map((satelliteVersion: SatelliteVersion) => {
    return (
      <FormSelectOption
        isDisabled={false}
        key={satelliteVersion.value}
        value={satelliteVersion.value}
        label={satelliteVersion.description}
        validated={typeValidated}
      />
    );
  });

  const handleNameChange = (manifestName: string) => {
    setNameFieldHelperText(
      'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
    );
    setManifestName(manifestName);
    setNameValidated('default');
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (
        /^[0-9A-Za-z_.-]*$/.test(manifestName) &&
        manifestName.length > 0 &&
        manifestName.length < 99
      ) {
        setNameValidated('success');
        setNameFieldHelperText(
          'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
        );
      } else {
        setNameValidated('error');
        setInvalidNameFieldText(
          'Name requirements have not been met. Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [manifestName]);

  const typeSelectOnChange = (value: string, _event: React.FormEvent<HTMLSelectElement>) => {
    setTypeValidated('success');
    //setFormValue(value);
    setManifestType(value);
  };

  React.useEffect(() => {
    const timer = setTimeout(
      (manifestType: string) => {
        if (manifestType != '') {
          setTypeValidated('success');
        } else if (manifestType == '') {
          setTypeValidated('error');
          setInvalidTypeText('Selection Required');
        }
      },
      500,
      manifestType
    );

    return () => clearTimeout(timer);
  }, [manifestType]);

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
        <Form isWidthLimited>
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
              onChange={typeSelectOnChange}
              name="satelliteManifestType"
              aria-label="FormSelect Input"
              id="create-satellite-manifest-form-type"
              validated={typeValidated}
            >
              <FormSelectOption
                name="satelliteManifestType"
                value=""
                isDisabled={true}
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
              isDisabled={
                nameValidated == 'default' ||
                typeValidated == 'error' ||
                nameValidated == 'error' ||
                typeValidated == 'default'
              }
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
