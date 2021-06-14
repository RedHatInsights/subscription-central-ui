import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationProvider';

interface Notification {
  type: string;
  message: string;
}

interface Notifications {
  notifications: Notification[];
  addSuccessNotification(message: string): void;
  addErrorNotification(message: string): void;
  addInfoNotification(message: string): void;
}

const useNotifications = (): Notifications => {
  const { notifications, addNotification } = useContext(NotificationContext);

  const addSuccessNotification = (message: string) => {
    addNotification('success', message);
  };

  const addErrorNotification = (message: string) => {
    addNotification('danger', message);
  };

  const addInfoNotification = (message: string) => {
    addNotification('success', message);
  };

  return { notifications, addSuccessNotification, addErrorNotification, addInfoNotification };
};

export default useNotifications;
