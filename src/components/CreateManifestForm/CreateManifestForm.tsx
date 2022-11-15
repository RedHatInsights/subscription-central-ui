import React, { useState, FC } from 'react';
import { useForm } from 'react-hook-form';
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
import manifestEntry from '../../utilities/factories/manifestEntry';

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
  const { satelliteVersions, handleModalToggle, submitForm, isError, isSuccess, isLoading } = props;
  const { handleSubmit } = useForm({ mode: 'onBlur' });
  const [manifestName, setManifestName] = useState('');
  const [manifestType, setManifestType] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [formValue, setFormValue] = React.useState('');
  const [invalidNameFieldText, setInvalidNameFieldText] = React.useState('');
  const [invalidTypeText, setInvalidTypeText] = React.useState('');
  const [nameValidated, setNameValidated] = React.useState<Validate>('default');
  const [typeValidated, setTypeValidated] = React.useState<Validate>('default');
  const [nameFieldHelperText, setNameFieldHelperText] = React.useState(
    'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
  );

  interface FormData {
    satelliteManifestName: string;
    satelliteManifestType: string;
  }

  const onSubmit = ({ satelliteManifestName, satelliteManifestType }: FormData): void => {
    submitForm(satelliteManifestName, satelliteManifestType);
    setManifestName(satelliteManifestName);
    setManifestType(satelliteManifestType);
    // setValidated('default');
  };
  // const shouldShowForm = isLoading === false && isError === false && isSuccess === false;

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
      />
    );
  });

  const handleNameChange = (manifestName: string, event: React.FormEvent<HTMLInputElement>) => {
    setNameFieldHelperText('');
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
        setNameFieldHelperText('');
      } else {
        setNameValidated('error');
        setInvalidNameFieldText(
          'Name requirements have not been met.Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [manifestName]);

  const typeSelectOnChange = (value: string) => {
    setManifestType(manifestType);
    setTypeValidated('success');
    setFormValue(value);
  };

  React.useEffect(() => {
    const timer = setTimeout((value: string) => {
      if (value === '') {
        setTypeValidated('success');
      } else {
        setTypeValidated('error');
        setInvalidTypeText('Selection Required');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [manifestType]);

  // useEffect is used to simulate a server call to validate the age 500ms after the user has entered a value, preventing calling the server on every keystroke
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
          type="string"
          helperText={nameFieldHelperText}
          helperTextInvalid={invalidNameFieldText}
          validated={nameValidated}
          fieldId="create-satellite-manifest-form-name"
        >
          <TextInput
            value={manifestName}
            onChange={handleNameChange}
            validated={nameValidated}
            helperText={nameFieldHelperText}
          />
        </FormGroup>
        <FormGroup
          label="Type"
          helperText={''}
          helperTextInvalid={invalidTypeText}
          fieldId="create-satellite-manifest-form-type"
          validated={typeValidated}
        >
          <FormSelect
            onChange={typeSelectOnChange}
            id="create-satellite-manifest-form-type"
            name="satelliteManifestType"
            aria-label="FormSelect Input"
            value={formValue}
            validated={typeValidated}
          >
            <FormSelectOption
              value={manifestType}
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
            key="confirm"
            id="create-manifest-button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isDisabled={
              (nameValidated && typeValidated == 'default') ||
              (nameValidated && typeValidated == 'error')
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

  // return (
  //   <>
  //     {shouldShowForm && <RenderForm />}
  //     {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
  //   </>
  // );
};
export default CreateManifestForm;
