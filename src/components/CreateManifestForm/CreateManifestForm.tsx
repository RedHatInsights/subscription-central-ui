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

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  submitForm: (name: string, version: string) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const CreateManifestForm: FC<CreateManifestFormProps> = (props) => {
  type validate = 'default' | 'error' | 'success';
  const { satelliteVersions, handleModalToggle, submitForm, isError, isSuccess } = props;
  const { handleSubmit } = useForm({ mode: 'onBlur' });
  const [manifestName, setManifestName] = useState('');
  const [manifestType, setManifestType] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [formValue, setFormValue] = React.useState('');
  const [invalidText, setInvalidText] = React.useState('');
  const [validated, setValidated] = React.useState<validate>('default');
  const [helperText, setHelperText] = React.useState(
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
    setValidated('success');
  };

  // const shouldShowForm = isLoading === false && isError === false && isSuccess === false;

  if (isSuccess) {
    addSuccessNotification(`Manifest ${manifestName} created`);
    handleModalToggle();
  } else if (isError) {
    addErrorNotification('Something went wrong. Please try again');
    handleModalToggle();
  }

  const options = satelliteVersions?.map((satelliteVersion: SatelliteVersion) => {
    return (
      <FormSelectOption
        isDisabled={false}
        key={satelliteVersion.value}
        value={satelliteVersion.value}
        label={satelliteVersion.description}
      />
    );
  });

  const handleNameChange = (manifestName: string) => {
    setHelperText('');
    setManifestName(manifestName);
    if (
      /^[0-9A-Za-z_.-]*$/.test(manifestName) &&
      manifestName.length > 0 &&
      manifestName.length < 99
    ) {
      setValidated('success');
    } else {
      setValidated('error');
      setInvalidText(
        'Name requirements have not been met.Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.'
      );
    }
  };

  const onChange = (value: string) => {
    setManifestType(manifestType);
    setFormValue(value);
    if (value === 'Satellite') {
      setValidated('success');
    } else if (value !== '') {
      setValidated('error');
      setInvalidText('Selection Required');
    } else {
      setValidated('default');
    }
  };
  // useEffect is used to simulate a server call to validate the age 500ms after the user has entered a value, preventing calling the server on every keystroke
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Create new manifest
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
          helperText={helperText}
          helperTextInvalid={invalidText}
          validated={validated ? 'default' : 'success'}
          fieldId="create-satellite-manifest-form-name"
        >
          <TextInput
            value={manifestName}
            onChange={handleNameChange}
            validated={validated ? 'default' : 'success'}
          />
        </FormGroup>
        <FormGroup
          label="Type"
          helpertext={''}
          helperTextInvalid={'Selection Required'}
          fieldId="create-satellite-manifest-form-type"
          validated={validated ? 'default' : 'success'}
        >
          <FormSelect
            onChange={onChange}
            id="create-satellite-manifest-form-type"
            name="satelliteManifestType"
            aria-label="FormSelect Input"
            value={formValue}
            validated={validated ? 'default' : 'success'}
          >
            <FormSelectOption
              value={manifestType}
              isDisabled={true}
              isPlaceholder={true}
              key="Select type"
              label="Select type"
            />
            {options.reverse()}
          </FormSelect>
        </FormGroup>
        <ActionGroup>
          <Button
            key="confirm"
            id="save-manifest-button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isDisabled={validated === 'default' && 'error'}
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

// return (
//   <>
//     {shouldShowForm && <RenderForm />}
//     {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
//   </>
// );

export default CreateManifestForm;
