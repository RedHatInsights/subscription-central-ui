import React, { FC, useState } from 'react';
import { v4 as uuid } from 'uuid';

const NotificationContext = React.createContext({
  notifications: [],
  addNotification: (variant: 'success' | 'danger' | 'info', message: string) => {},
  removeNotification: (key: string) => {}
});

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (variant: string, message: string) => {
    setNotifications([...notifications, { variant: variant, message: message, key: uuid() }]);
  };

  const removeNotification = (key: string) => {
    setNotifications(notifications.filter((notification) => notification.key !== key));
  };

  const contextValue = {
    notifications,
    addNotification: (variant: string, message: string) => addNotification(variant, message),
    removeNotification: (key: string) => removeNotification(key)
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider as default };
