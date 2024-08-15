"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  message: string;
  status: 'success' | 'error' | 'info';
  transactionHash: `0x${string}` | undefined;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
