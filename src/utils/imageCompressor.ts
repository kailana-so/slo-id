import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid"; 

export const compressImage = async (file: File) => {
   // Generate a UUID to be used for unique filenames
   const uuid = uuidv4();

  // Compress the normal image
  const fullImage = await imageCompression(file, { maxSizeMB: 10, maxWidthOrHeight: 1024 });

  // Rename the normal image with the UUID and "_full" suffix
  const fullImageName = `${uuid}_full.${fullImage.type.split('/')[1]}`;
  const fullImageFile = new File([fullImage], fullImageName, { type: fullImage.type });

  // Compress the thumbnail image
  const thumbnailImage = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 200 });

    // Rename the thumbnail image with the UUID and "_thumbnail" suffix
    const thumbnailImageName = `${uuid}_thumbnail.${thumbnailImage.type.split('/')[1]}`;
    const thumbnailImageFile = new File([thumbnailImage], thumbnailImageName, { type: thumbnailImage.type });

  return { fullImageFile, thumbnailImageFile };
};