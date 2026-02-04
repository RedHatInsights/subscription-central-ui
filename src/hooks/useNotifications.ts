import React, { useContext } from 'react';
import {
  NotificationContext,
  NotificationOptions,
  NotificationVariantType
} from '../contexts/NotificationProvider';

interface Notification {
  variant: NotificationVariantType;
  message: string;
  key: string;
  timeout?: boolean;
  actionLinks?: React.ReactNode;
  downloadHref?: string;
}

interface Notifications {
  notifications: Notification[];
  addSuccessNotification(message: string, options?: NotificationOptions): string;
  addErrorNotification(message: string, options?: NotificationOptions): string;
  addInfoNotification(message: string, options?: NotificationOptions): string;
  removeNotification(key: string, options?: NotificationOptions): void;
}

const useNotifications = (): Notifications => {
  const { notifications, addNotification, removeNotification } = useContext(NotificationContext);

  const addSuccessNotification = (message: string, options?: NotificationOptions): string => {
    return addNotification('success', message, options);
  };

  const addErrorNotification = (message: string, options?: NotificationOptions): string => {
    return addNotification('danger', message, options);
  };

  const addInfoNotification = (message: string, options?: NotificationOptions): string => {
    return addNotification('info', message, options);
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
