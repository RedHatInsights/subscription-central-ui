import React, { FC, useState } from 'react';
import { AlertActionLink } from '@patternfly/react-core';
import { v4 as uuid } from 'uuid';
import { Alert } from '@patternfly/react-core';

type NotificationVariantType = 'success' | 'danger' | 'info';

interface NotificationProps {
  variant: NotificationVariantType;
  message: string;
  key: string;
  timeout?: boolean;
  actionLinks?: React.ReactNode;
}

export type NotificationOptions = {
  hasTimeout?: boolean;
  alertLinkText?: string;
  alertLinkHref?: string;
};

const NotificationContext = React.createContext({
  notifications: [],
  addNotification: (
    variant: NotificationVariantType,
    message: string,
    options?: NotificationOptions
  ) => null,
  removeNotification: (key: string) => null
});

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (
    variant: NotificationVariantType,
    message: string,
    options?: NotificationOptions
  ): string => {
    const notificationKey: string = uuid();
    const newNotificationProps: NotificationProps = {
      variant: variant,
      message: message,
      key: notificationKey,
      timeout: options?.hasTimeout ?? true
    };

    if (options?.alertLinkText && options?.alertLinkHref) {
      const alertLink = (
        <>
          <AlertActionLink>
            <a download href={options.alertLinkHref}>
              {options.alertLinkText}
            </a>
          </AlertActionLink>
        </>
      );
      newNotificationProps.actionLinks = alertLink;
    }

    setNotifications([...notifications, { ...newNotificationProps }]);
    return notificationKey;
  };

  const removeNotification = (key: string) => {
    console.log('hit remove notification', key);
    setNotifications(notifications.filter((notification) => notification.key !== key));
  };

  const contextValue = {
    notifications,
    addNotification: (
      variant: NotificationVariantType,
      message: string,
      options?: NotificationOptions
    ) => {
      return addNotification(variant, message, options);
    },
    removeNotification: (key: string) => removeNotification(key)
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationVariantType, NotificationContext, NotificationProvider as default };
