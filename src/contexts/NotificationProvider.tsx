import React, { FC, ReactNode, useState, useCallback } from 'react';

const NotificationContext = React.createContext({
  notifications: [],
  addNotification: (type: string, message: string) => {}
});

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type: string, message: string) => {
    setNotifications(notifications.concat({ type: type, message: message }));
  };

  const contextValue = {
    notifications,
    addNotification: useCallback(
      (type: string, message: string) => addNotification(type, message),
      []
    )
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider as default };
