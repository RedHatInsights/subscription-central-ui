import React, { FC } from 'react';
import CreateManifestForm from './CreateManifestForm';
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
    data: createManifestResponseData,
    mutate,
    isLoading: isCreatingManifest,
    isSuccess
  } = useCreateSatelliteManifest();

  const submitForm = (name: string, version: string) => {
    mutate({ name, version });
  };

  /**
   * The API will "succeed", but with an error status, so we
   * need to check for data to confirm success
   */

  const hasCreatedManifest = typeof createManifestResponseData !== 'undefined';
  const errorCreatingManifest = isSuccess && !hasCreatedManifest;

  return (
    <>
      {isLoadingSatelliteVersions && <CreateManifestFormLoading title="Loading..." />}
      {!isLoadingSatelliteVersions && !hasSatelliteVersionsError && (
        <CreateManifestForm
          satelliteVersions={data?.body}
          submitForm={submitForm}
          isLoading={isCreatingManifest}
          isError={errorCreatingManifest}
          isSuccess={hasCreatedManifest}
          handleModalToggle={handleModalToggle}
        />
      )}
    </>
  );
};

export default CreateManifestFormContainer;
