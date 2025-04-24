"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconX, IconInfoCircle, IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  type = 'info', 
  message, 
  onClose,
  autoHide = true,
  duration = 3000
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoHide) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoHide, duration, onClose]);

  const getToastStyles = (): { bgColor: string; textColor: string; borderColor: string } => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800/30'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800/30'
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          textColor: 'text-amber-800 dark:text-amber-300',
          borderColor: 'border-amber-200 dark:border-amber-800/30'
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800/30'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IconCircleCheck className="text-green-500 dark:text-green-400" />;
      case 'error':
        return <IconAlertTriangle className="text-red-500 dark:text-red-400" />;
      case 'warning':
        return <IconAlertTriangle className="text-amber-500 dark:text-amber-400" />;
      case 'info':
      default:
        return <IconInfoCircle className="text-blue-500 dark:text-blue-400" />;
    }
  };

  const styles = getToastStyles();

  return (
    <AnimatePresence>
      <div className="fixed top-4 right-4 z-50 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`${styles.bgColor} ${styles.textColor} p-4 rounded-lg shadow-md backdrop-blur-md 
            border ${styles.borderColor} flex items-start`}
        >
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-grow">
            <p className="font-medium">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-4 flex-shrink-0 p-1 rounded-full 
            hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <IconX size={18} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Toast container to manage multiple toasts
interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  return (
    <div className="toast-container fixed top-5 right-5 z-50 flex flex-col gap-3">
      {children}
    </div>
  );
};

export default Toast; 