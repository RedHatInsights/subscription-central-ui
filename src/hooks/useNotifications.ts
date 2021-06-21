import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationProvider';

interface Notification {
  variant: string;
  message: string;
  key: string;
}

interface Notifications {
  notifications: Notification[];
  addSuccessNotification(message: string): void;
  addErrorNotification(message: string): void;
  addInfoNotification(message: string): void;
  removeNotification(key: string): void;
}

const useNotifications = (): Notifications => {
  const { notifications, addNotification, removeNotification } = useContext(NotificationContext);

  const addSuccessNotification = (message: string) => {
    addNotification('success', message);
  };

  const addErrorNotification = (message: string) => {
    addNotification('danger', message);
  };

  const addInfoNotification = (message: string) => {
    addNotification('info', message);
  };

  return {
    notifications,
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification,
    removeNotification
  };
};

export default useNotifications;
