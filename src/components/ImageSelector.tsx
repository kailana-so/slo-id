"use client"

import { compressImage } from "@/lib/image/imageCompressor.client";
import { convertImage } from "@/lib/image/imageConverter.client";
import React from "react";
import { v4 as uuidv4 } from "uuid"; 
import { FormData } from "@/types/note";


type ImageSelectorProps = {
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

const ImageSelector = ({ setFormData }: ImageSelectorProps) => {

    const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const imageId = uuidv4();

        if (!event.target.files) return;
        let file = event.target.files[0];
    
        file = await convertImage(file) // Convert HEIC if needed
    
        const { fullImageFile, thumbnailImageFile } = await compressImage(file, imageId); // TODO: Compress image - to be move to a BG process
        setFormData((prev) => ({
            ...prev,
            imageFiles: { fullImageFile, thumbnailImageFile },
            imageId
        }));
    };

    return (
            <div className="pt-1">
                <label key="photo-upload">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImage}
                    className="max-w-64"
                />
                </label>
            </div>
    );
};

export default ImageSelector;
