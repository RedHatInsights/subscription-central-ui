import React, { FC } from 'react';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Switch } from '@patternfly/react-core/dist/dynamic/components/Switch';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import useUpdateManifestSCAStatus from '../../hooks/useUpdateManifestSCAStatus';
import './SCAStatusSwitch.scss';
import { User } from '../../hooks/useUser';

interface SCAStatusSwitchProps {
  scaStatus: string;
  uuid: string;
  user: User;
}

const SCAStatusSwitch: FC<SCAStatusSwitchProps> = ({ scaStatus, uuid, user }) => {
  const isChecked = scaStatus.toLowerCase() === 'enabled';

  const { data, mutate, isLoading, isError, isSuccess } = useUpdateManifestSCAStatus();

  const failedUpdatingSCAStatus = isError === true || (isSuccess && !data);

  const updateManifestSCAStatus = (uuid: string, currentSCAStatus: string) => {
    const newSCAStatus = currentSCAStatus.toLowerCase() === 'enabled' ? 'disabled' : 'enabled';
    mutate({ uuid, newSCAStatus });
  };

  const handleChange = () => {
    updateManifestSCAStatus(uuid, scaStatus);
  };

  const ErrorState = () => (
    <>
      <ExclamationCircleIcon
        color="var(--pf-global--danger-color--100)"
        className="sca-status-error-icon"
      />
      <span className="sca-status-error-msg">
        Something went wrong. Please refresh the page and try again.
      </span>
    </>
  );

  const LoadingState = () => <Spinner size="lg" className="sca-status-spinner" />;

  const DisallowedState = () => <p>N/A</p>;

  const SCASwitch = () => (
    <Switch
      id={`sca-status-switch-${uuid}`}
      data-testid="sca-status-switch"
      aria-label={`SCA Status for this Manifest is ${scaStatus}`}
      isChecked={isChecked}
      onChange={handleChange}
      label="Enabled"
      isDisabled={!user.canWriteManifests}
    />
  );

  if (failedUpdatingSCAStatus) {
    return <ErrorState />;
  } else if (isLoading) {
    return <LoadingState />;
  } else if (scaStatus == 'disallowed') {
    return <DisallowedState />;
  } else {
    return <SCASwitch />;
  }
};

export default SCAStatusSwitch;
