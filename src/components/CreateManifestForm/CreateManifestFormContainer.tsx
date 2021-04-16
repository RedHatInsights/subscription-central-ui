import React, { FC } from 'react';
import CreateManifestForm from './CreateManifestForm';
import CreateManifestFormError from './CreateManifestFormError';
import CreateManifestFormLoading from './CreateManifestFormLoading';
import useCreateSatelliteManifest from '../../hooks/useCreateSatelliteManifest';
import useSatelliteVersions from '../../hooks/useSatelliteVersions';

interface CreateManifestFormContainerProps {
  handleModalToggle: () => void;
}

const CreateManifestFormContainer: FC<CreateManifestFormContainerProps> = ({
  handleModalToggle
}) => {
  const {
    data,
    isLoading: isLoadingSatelliteVersions,
    isError: hasSatelliteVersionsError
  } = useSatelliteVersions();

  const {
    mutate,
    isLoading: isCreatingManifest,
    isError: errorCreatingManifest,
    isSuccess
  } = useCreateSatelliteManifest();

  const submitForm = (name: string, version: string) => {
    mutate({ name, version });
  };

  return (
    <>
      {isLoadingSatelliteVersions && <CreateManifestFormLoading title="Loading..." />}
      {errorCreatingManifest && <CreateManifestFormError />}
      {!isLoadingSatelliteVersions && !hasSatelliteVersionsError && (
        <CreateManifestForm
          satelliteVersions={data?.body}
          submitForm={submitForm}
          isLoading={isCreatingManifest}
          isError={errorCreatingManifest}
          isSuccess={isSuccess}
          handleModalToggle={handleModalToggle}
        />
      )}
    </>
  );
};

export default CreateManifestFormContainer;
