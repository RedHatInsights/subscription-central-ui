import React, { useState, FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  ActionGroup,
  Form,
  FormGroup,
  TextInput,
  Title,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  Tooltip
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import CreateManifestFormLoading from './CreateManifestFormLoading';
import { SatelliteVersion } from '../../hooks/useSatelliteVersions';
import useNotifications from '../../hooks/useNotifications';

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  submitForm: (name: string, version: string) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const CreateManifestForm: FC<CreateManifestFormProps> = (props) => {
  // The success can probably be removed and have it stay as default
  // as it's not in the sketch wireframe, but that could be a design discussion
  type validate = 'success' | 'error' | 'default';
  const { satelliteVersions, handleModalToggle, submitForm, isLoading, isError, isSuccess } = props;
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onBlur' });
  const [manifestName, setManifestName] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  // const [name, setName] = React.useState('')
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
  };

  const shouldShowForm = isLoading === false && isError === false && isSuccess === false;

  if (isSuccess) {
    addSuccessNotification(`Manifest ${manifestName} created`);
    handleModalToggle();
  } else if (isError) {
    addErrorNotification('Something went wrong. Please try again');
    handleModalToggle();
  }

  const handleNameInput = (manifestName: string, event: React.FormEvent<HTMLInputElement>) => {
    setManifestName(manifestName);
    setValidated('default');
  };

  // useEffect is used to simulate a server call to validate the age 500ms after the user has entered a value, preventing calling the server on every keystroke
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (
        /^[0-9A-Za-z_.-]*$/.test(manifestName) &&
        manifestName.length > 0 &&
        manifestName.length < 99
      ) {
        setValidated('success');
      } else {
        setValidated('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [manifestName]);

  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Create new manifest
      </Title>
      <p style={{ margin: '30px 0' }}>
        Creating a manifest allows you to export subscriptions to your on-premise subscription
        management application. Match the type and version of the subscription management
        application you are using. All fields are required.
      </p>
      <Form isWidthLimited>
        <FormGroup
          label="Name"
          type="string"
          helperText={helperText}
          helperTextInvalid={helperText}
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="create-satellite-manifest-form-name"
          validated={validated}
        >
          <TextInput
            validated={validated}
            value={manifestName}
            onChange={handleNameInput}
            isRequired
          />
        </FormGroup>
        <FormGroup
          label="Type"
          helperTextInvalid={errors.satelliteManifestType?.message}
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          validated={errors.satelliteManifestType ? 'error' : 'default'}
          isRequired
          fieldId="create-satellite-manifest-form-type"
        >
          {/* This controller will need to be removed and follow a similar structure for above */}
          <Controller
            name="satelliteManifestType"
            control={control}
            rules={{ required: 'Please select a version for your new manifest' }}
            defaultValue=""
            render={({ field }) => (
              <FormSelect
                aria-label="FormSelect Input"
                id="create-satellite-manifest-form-type"
                {...field}
              >
                <FormSelectOption
                  isDisabled={true}
                  key="Select type"
                  value=""
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
            )}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            key="confirm"
            id="save-manifest-button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
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
//     {/* {shouldShowForm && <RenderForm />} */}
//     {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
//   </>
// );

export default CreateManifestForm;
