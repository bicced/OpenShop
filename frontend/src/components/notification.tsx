import React from 'react';
import type { Notification } from '@/config/notificationprovider';

interface IProps {
  notification: Notification;
  onClose: () => void;
}

export default function Notification({ notification, onClose }: IProps) {
  const statusStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`flex items-center p-4 border-l-4 ${statusStyles[notification.status]} shadow-lg rounded-md mb-4`}>
      <div className="flex-grow">
        <b>{notification.message}</b>
        <p>tx: {notification.transactionHash}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-sm font-semibold">X</button>
    </div>
  );
};
