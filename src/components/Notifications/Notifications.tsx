import React, { FC } from 'react';
import { Alert, AlertActionCloseButton, AlertGroup } from '@patternfly/react-core';
import useNotifications from '../../hooks/useNotifications';

const Notifications: FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <AlertGroup isToast>
      {notifications.map((notification, i) => (
        <Alert
          isLiveRegion
          timeout={true}
          title={notification.message}
          variant={notification.variant}
          key={notification.key}
          actionClose={
            <AlertActionCloseButton
              data-testid={`notification-close-btn-${i}`}
              title={notification.message}
              variantLabel={`${notification.variant} alert`}
              onClose={() => removeNotification(notification.key)}
            />
          }
        />
      ))}
    </AlertGroup>
  );
};

export default Notifications;
