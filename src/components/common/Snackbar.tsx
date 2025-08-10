"use client";

import React, { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({ 
  message, 
  type, 
  isOpen, 
  onClose, 
  duration = 2000,
}) => {
    useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const Icon = type === 'success' ? CheckCircleIcon : ErrorIcon;

  return (
    <div className={`snackbar ${type} ${isOpen ? 'slide-in' : 'slide-out'}`}>
      <Icon />
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-auto hover"
      >
        ×
      </button>
    </div>
  );
};

export default Snackbar; 