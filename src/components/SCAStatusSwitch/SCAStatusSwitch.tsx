import React, { FC } from 'react';
import { Spinner, Switch } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import useUpdateManifestSCAStatus from '../../hooks/useUpdateManifestSCAStatus';
import './SCAStatusSwitch.scss';

interface SCAStatusSwitchProps {
  scaStatus: string;
  uuid: string;
}
const SCAStatusSwitch: FC<SCAStatusSwitchProps> = ({ scaStatus, uuid }) => {
  const isChecked = scaStatus.toLowerCase() === 'enabled';

  const { data, mutate, isLoading, isError, isSuccess } = useUpdateManifestSCAStatus();

  const hasError = isError === true || (isSuccess && !data);

  const updateManifestSCAStatus = (uuid: string, currentSCAStatus: string) => {
    const newSCAStatus = currentSCAStatus.toLowerCase() === 'enabled' ? 'disabled' : 'enabled';
    mutate({ uuid, newSCAStatus });
  };

  const handleChange = () => {
    updateManifestSCAStatus(uuid, scaStatus);
  };

  if (hasError === true) {
    return (
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
  }

  if (isLoading === true) {
    return <Spinner size="lg" className="sca-status-spinner" />;
  } else if (scaStatus === 'disallowed') {
    return (
      <>
        <p>N/A</p>
      </>
    );
  } else {
    return (
      <>
        <Switch
          id={`sca-status-switch-${uuid}`}
          data-testid="sca-status-switch"
          aria-label={`SCA Status for this Manifest is ${scaStatus}`}
          isChecked={isChecked}
          onChange={handleChange}
          label="Enabled"
          labelOff="Disabled"
        />
      </>
    );
  }
};

export default SCAStatusSwitch;
