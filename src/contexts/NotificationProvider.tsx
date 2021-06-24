import React, { FC, useState } from 'react';
import { v4 as uuid } from 'uuid';

type NotificationVariantType = 'success' | 'danger' | 'info';

const NotificationContext = React.createContext({
  notifications: [],
  addNotification: (variant: NotificationVariantType, message: string) => null,
  removeNotification: (key: string) => null
});

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (variant: NotificationVariantType, message: string) => {
    setNotifications([...notifications, { variant: variant, message: message, key: uuid() }]);
  };

  const removeNotification = (key: string) => {
    setNotifications(notifications.filter((notification) => notification.key !== key));
  };

  const contextValue = {
    notifications,
    addNotification: (variant: NotificationVariantType, message: string) => {
      addNotification(variant, message);
    },
    removeNotification: (key: string) => removeNotification(key)
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationVariantType, NotificationContext, NotificationProvider as default };
