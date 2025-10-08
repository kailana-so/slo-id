"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useFullImage } from "@/hooks/useFullImagesCache";
import CloseIcon from "@mui/icons-material/Close";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;   // thumbnail/fallback
  alt: string;
  imageId?: string;
  userId?: string;
}

export default function ImageModal({
  isOpen, onClose, imageSrc, alt, imageId, userId,
}: ImageModalProps) {
  // data fetch/cache state
  const { data: src, isFetching, isSuccess } =
    useFullImage(userId ?? "", imageId ?? "", imageSrc);

  // decode/render state
  const [decoded, setDecoded] = useState(false);

  // whenever we open or the src changes, wait for a fresh decode
  useEffect(() => {
    if (!isOpen) return;
    setDecoded(false);
  }, [isOpen, src]);

  if (!isOpen) return null;

  const showSpinner = isFetching || !decoded || !src;

  return (
    <div className="generic-modal" onClick={onClose}>
      <div className="generic-modal-content" onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={onClose} className="generic-modal-close"/>
        <div className="generic-modal-card relative">
          {showSpinner && (
            <div className="absolute inset-0 grid place-items-center z-10 pointer-events-none">
              <div className="spinner" />
            </div>
          )}

          {/* Render image when we have some src (placeholder or full) */}
          {src && (
            <Image
              key={src} // force a fresh load lifecycle per URL
              src={src}
              alt={alt}
              width={500}
              height={500}
              onLoad={() => setDecoded(true)}
              onLoadingComplete={() => setDecoded(true)}
              className={`generic-modal-image transition-opacity ${decoded ? "opacity-100" : "opacity-0"}`}
            />
          )}

          {/* Optional: if query disabled (no ids), fall back to thumb only */}
          {!isSuccess && !src && (
            <Image
              key={imageSrc}
              src={imageSrc}
              alt={alt}
              width={500}
              height={500}
              onLoad={() => setDecoded(true)}
              className={`generic-modal-image transition-opacity ${decoded ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
