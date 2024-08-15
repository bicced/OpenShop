"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WriteContractErrorType } from '@wagmi/core';

// Notification Types and Context
interface Notification {
  id: string;
  message: string;
  status: 'success' | 'error' | 'info';
  transactionHash: `0x${string}` | undefined;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a CombinedProvider');
  }
  return context;
};

// Transaction Types and Context
interface TransactionContextType {
  hash: `0x${string}` | undefined;
  writeContract: ((arg: any) => void) | undefined;
  error: WriteContractErrorType | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a CombinedProvider');
  }
  return context;
};

// Combined Provider Component
export const CombinedProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: hash, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const addNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  useEffect(() => {
    if (isConfirming) {
      addNotification({ id: Date.now().toString(), message: 'Transaction is confirming...', status: 'info', transactionHash: hash });
    } else if (isConfirmed) {
      addNotification({ id: Date.now().toString(), message: 'Transaction confirmed successfully!', status: 'success', transactionHash: hash });
    } else if (error) {
      addNotification({ id: Date.now().toString(), message: `Error: ${(error as BaseError).shortMessage || error.message}`, status: 'error', transactionHash: hash });
    }
  }, [isConfirming, isConfirmed, error]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      <TransactionContext.Provider value={{ hash, writeContract, error }}>
        {children}
      </TransactionContext.Provider>
    </NotificationContext.Provider>
  );
};
