import imageCompression from "browser-image-compression";

export const compressImage = async (file: File, imageId: string) => {
  // Compress full image
  const fullImage = await imageCompression(file, { maxSizeMB: 10, maxWidthOrHeight: 1024 });
  const fullImageBase64 = await fileToBase64(fullImage);
  
  // Compress thumbnail
  const thumbnailImage = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 200 });
  const thumbnailBase64 = await fileToBase64(thumbnailImage);

  return {
    fullImageFile: {
      name: `${imageId}_full.${file.type.split('/')[1]}`,
      type: file.type,
      content: fullImageBase64
    },
    thumbnailImageFile: {
      name: `${imageId}_thumbnail.${file.type.split('/')[1]}`,
      type: file.type,
      content: thumbnailBase64
    }
  };
};

// Convert File to Base64
const fileToBase64 = (file: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1]; // Remove the data prefix
          resolve(base64String);
        } else {
          reject(new Error("FileReader result is not a string"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
