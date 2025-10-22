"use client";

import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface SnackbarProps {
  message: string;
  type: "success" | "error";
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
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [isOpen, duration, onClose]);

  const Icon = type === "success" ? CheckCircleIcon : ErrorIcon;

  return (
    <div className={`snackbar ${type} ${isOpen ? "slide-in" : "slide-out"}`}>
      <Icon />
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default Snackbar;
