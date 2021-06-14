import React, { FC } from 'react';
import { Alert, AlertGroup } from '@patternfly/react-core';
import useNotifications from '../../hooks/useNotifications';

const Notifications: FC = () => {
  const { notifications } = useNotifications();

  return (
    <AlertGroup isToast>
      {notifications.map((notification, index) => (
        <Alert
          isLiveRegion
          timeout={true}
          title={notification.message}
          variant={notification.type}
          key={index}
        />
      ))}
    </AlertGroup>
  );
};

export default Notifications;
