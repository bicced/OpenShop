"use client"
import React from 'react';
import Notification from './notification';
import { useNotification } from '@/config/notificationprovider';

export default function NotificationList() {
  const { notifications, removeNotification } = useNotification();
  return (
    <div className="fixed bottom-0 right-0 p-4 flex flex-col space-y-2 z-50">
      {notifications.map(notification => (
        <Notification notification={notification} onClose={() => removeNotification(notification.id)}/>
      ))}
    </div>
  );
};
