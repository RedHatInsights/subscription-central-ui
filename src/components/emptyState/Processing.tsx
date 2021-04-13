import React, { FC } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

const Processing: FC = () => {
  return (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );
};

export default Processing;
