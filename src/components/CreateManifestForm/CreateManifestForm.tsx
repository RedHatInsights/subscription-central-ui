import React, { useState, FC, useEffect } from 'react';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ActionGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import useNotifications from '../../hooks/useNotifications';
import { SatelliteVersion } from '../../hooks/useSatelliteVersions';
import CreateManifestFormLoading from './CreateManifestFormLoading';
import { HelperText } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { HelperTextItem } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { HttpError } from '../../utilities/errors';
import { supportLink } from '../../utilities/consts';

interface CreateManifestFormProps {
  satelliteVersions: SatelliteVersion[];
  handleModalToggle: () => void;
  submitForm: (name: string, version: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error: HttpError;
}

const CreateManifestForm: FC<CreateManifestFormProps> = (props) => {
  type Validate = 'default' | 'error' | 'success';
  const { satelliteVersions, handleModalToggle, isLoading, submitForm, error, isSuccess } = props;
  const [inputFieldBlur, setinputFieldBlur] = React.useState(false);
  const [dropdownFieldBlur, setDropdownFieldBlur] = React.useState(false);
  const [manifestName, setManifestName] = useState('');
  const [manifestType, setManifestType] = useState('');
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [invalidTypeText, setInvalidTypeText] = React.useState('');
  const [nameValidated, setNameValidated] = React.useState<Validate>('default');
  const [typeValidated, setTypeValidated] = React.useState<Validate>('default');

  const nameFieldHelperText =
    'Your manifest name must be unique and must contain only numbers, letters, underscores, and hyphens.';
  const invalidNameFieldText = `Name requirements have not been met. ${nameFieldHelperText}`;

  const onSubmit = (): void => {
    submitForm(manifestName, manifestType);
  };

  const shouldShowForm = isLoading === false && error === null && isSuccess === false;

  useEffect(() => {
    if (isSuccess) {
      handleModalToggle();
      addSuccessNotification(`Manifest ${manifestName} created`);
    } else if (error?.status == 403) {
      handleModalToggle();
      addErrorNotification(
        'A Satellite subscription is required to create a manifest. Contact support to check if you need a new subscription.',
        {
          alertLinkText: 'Contact support',
          alertLinkHref: supportLink
        }
      );
    } else if (error != undefined) {
      handleModalToggle();
      addErrorNotification('Something went wrong. Please try again');
    }
  }, [isLoading]);

  const satelliteTypeOptions = satelliteVersions?.map((satelliteVersion: SatelliteVersion) => {
    return (
      <FormSelectOption
        key={satelliteVersion.value}
        value={satelliteVersion.value}
        label={satelliteVersion.description}
      />
    );
  });

  const onBlurHandler = () => {
    setinputFieldBlur(true);
  };

  const formSelectBlurHandler = () => {
    setDropdownFieldBlur(true);
  };

  const handleNameChange = (manifestName: string) => {
    setManifestName(manifestName);
  };

  const isValidManifestName = (manifestName: string) =>
    /^[0-9A-Za-z_.-]*$/.test(manifestName) && manifestName.length > 0 && manifestName.length < 99;

  useEffect(() => {
    if (isValidManifestName(manifestName)) {
      setNameValidated('success');
    } else if (manifestName != '') {
      setNameValidated('error');
    } else if (manifestName == '' && inputFieldBlur) {
      setNameValidated('error');
    }
  }, [manifestName, inputFieldBlur]);

  const handleTypeChange = (value: string) => {
    setManifestType(value);
  };

  React.useEffect(() => {
    if (manifestType != '') {
      setTypeValidated('success');
    } else if (manifestType == '' && dropdownFieldBlur && inputFieldBlur) {
      setTypeValidated('error');
      setInvalidTypeText('Selection Required');
    } else {
      setTypeValidated('default');
    }
  }, [manifestType, dropdownFieldBlur, inputFieldBlur]);

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
          <FormGroup label="Name" fieldId="create-satellite-manifest-form-name">
            <TextInput
              name="satelliteManifestName"
              value={manifestName}
              onChange={(_event: React.FormEvent<HTMLInputElement>, manifestName: string) =>
                handleNameChange(manifestName)
              }
              onBlur={onBlurHandler}
              validated={nameValidated}
              id="create-satellite-manifest-form-name"
              autoFocus={true}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem
                  variant={nameValidated}
                  {...(nameValidated == 'error' && { icon: <ExclamationCircleIcon /> })}
                >
                  {nameValidated != 'error' ? nameFieldHelperText : invalidNameFieldText}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup label="Type" fieldId="create-satellite-manifest-form-type">
            <FormSelect
              value={manifestType}
              onChange={(_event: React.FormEvent<HTMLSelectElement>, value: string) =>
                handleTypeChange(value)
              }
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
                isPlaceholder
                key="Select type"
                label="Select type"
              />
              {satelliteTypeOptions}
            </FormSelect>
            {typeValidated == 'error' && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant={typeValidated} icon={<ExclamationCircleIcon />}>
                    {invalidTypeText}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
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
      {shouldShowForm && <RenderForm />}
      {isLoading && <CreateManifestFormLoading title="Creating manifest..." />}
    </>
  );
};
export default CreateManifestForm;
