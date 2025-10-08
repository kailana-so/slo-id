"use client";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GenericModal({ isOpen, onClose, children }: GenericModalProps) {
  if (!isOpen) return null;

  return (
    <div className="generic-modal" onClick={onClose}>
      <div className="generic-modal-content" onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={onClose} className="generic-modal-close" />
        <div className="generic-modal-card relative">
          {children}
        </div>
      </div>
    </div>
  );
}
