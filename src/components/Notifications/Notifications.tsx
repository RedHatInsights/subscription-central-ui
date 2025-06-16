import React, { FC } from 'react';
import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertActionCloseButton } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertGroup } from '@patternfly/react-core/dist/dynamic/components/Alert';
import useNotifications from '../../hooks/useNotifications';

const Notifications: FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <AlertGroup isToast>
      {notifications.map((notification, i) => (
        <Alert
          isLiveRegion
          timeout={notification.timeout}
          title={notification.message}
          variant={notification.variant}
          key={notification.key}
          actionLinks={notification.actionLinks}
          actionClose={
            <AlertActionCloseButton
              data-testid={`notification-close-btn-${i}`}
              title={notification.message}
              variantLabel={`${notification.variant} alert`}
              onClose={() => {
                removeNotification(notification.key);

                if (notification?.downloadHref) {
                  window.URL.revokeObjectURL(notification.downloadHref);
                }
              }}
            />
          }
        />
      ))}
    </AlertGroup>
  );
};

export default Notifications;
