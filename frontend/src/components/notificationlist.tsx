"use client";
import React from 'react';
import { useNotification } from '@/config/transactioncontext';

export default function NotificationList() {
  const { notifications, removeNotification } = useNotification();

  const statusStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 flex flex-col space-y-2 z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center p-4 border-l-4 ${statusStyles[notification.status]} shadow-lg rounded-md mb-4`}
        >
          <div className="flex-grow">
            <b>{notification.message}</b>
            {notification.transactionHash && (
              <p>tx: {notification.transactionHash}</p>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-sm font-semibold"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
