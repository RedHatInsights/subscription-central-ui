import React, { FC, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

const NotificationContext = React.createContext({
  notifications: [],
  addNotification: (type: string, message: string) => {}
});

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type: string, message: string) => {
    setNotifications([...notifications, { type: type, message: message, key: uuid() }]);
  };

  const contextValue = {
    notifications,
    addNotification: (type: string, message: string) => addNotification(type, message)
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider as default };
