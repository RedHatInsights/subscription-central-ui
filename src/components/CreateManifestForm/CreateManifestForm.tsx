import React, { useState, FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  ActionGroup,
  Form,
  FormGroup,
  TextInput,
  Title,
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
  const { satelliteVersions, handleModalToggle, submitForm, isLoading, isError, isSuccess } = props;
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onBlur' });
  const [manifestName, setManifestName] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();

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

  const RenderForm = () => {
    return (
      <>
        <Title headingLevel="h3" size="2xl">
          Create new manifest
        </Title>
        <p style={{ margin: '30px 0' }}>
          Creating a new manifest allows you to export subscriptions to your on-premise subscription
          management application.
        </p>
        <Form isWidthLimited>
          <FormGroup
            label="Name"
            helperTextInvalid={errors.satelliteManifestName?.message}
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={errors.satelliteManifestName ? 'error' : 'default'}
            labelIcon={
              <Tooltip
                position="top"
                content={
                  <div>
                    Provide a name that will help you associate this manifest with a specific
                    organization or on-premise subscription management application.
                  </div>
                }
              >
                <span
                  tabIndex={0}
                  aria-label="Provide a name that will help you associate this manifest with a specific
                organization or on-premise subscription management application."
                >
                  <HelpIcon />
                </span>
              </Tooltip>
            }
            isRequired
            fieldId="create-satellite-manifest-form-name"
          >
            <Controller
              name="satelliteManifestName"
              control={control}
              defaultValue=""
              rules={{
                required: 'Please provide a name for your new manifest',
                maxLength: {
                  value: 99,
                  message: 'Your manifest name must be less than 100 characters'
                },
                pattern: {
                  value: /^[0-9A-Za-z_.-]*$/,
                  message: `Your manifest name may contain
                  only numbers, letters, underscores, hyphens, and periods.`
                }
              }}
              render={({ field }: any) => (
                <TextInput
                  isRequired
                  type="text"
                  id="create-satellite-manifest-form-name"
                  placeholder="Name"
                  {...field}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label="Type"
            helperTextInvalid={errors.satelliteManifestType?.message}
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={errors.satelliteManifestType ? 'error' : 'default'}
            labelIcon={
              <Tooltip
                position="top"
                content={
                  <div>
                    Due to variation in supported features, it is important to match the type and
                    version of the subscription management application you are using.
                  </div>
                }
              >
                <span
                  tabIndex={0}
                  aria-label="Due to variation in supported features, it is important to match the type and
              version of the subscription management application you are using."
                >
                  <HelpIcon />
                </span>
              </Tooltip>
            }
            isRequired
            fieldId="create-satellite-manifest-form-type"
          >
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
    );
  };

  return (
    <>
      {shouldShowForm && <RenderForm />}
      {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
    </>
  );
};

export default CreateManifestForm;
