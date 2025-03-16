interface UploadPayload {
    thumbnailImageFile: File;
    fullImageFile: File;
  }
  
  export const uploadClient = async (imageFiles: UploadPayload) => {
    const { thumbnailImageFile, fullImageFile } = imageFiles;
  
    console.log(thumbnailImageFile, fullImageFile, "thumbnail, fullImage");
  
    try {
      const formData = new FormData();
      formData.append("thumbnailImageFile", thumbnailImageFile);
      formData.append("fullImageFile", fullImageFile);
  
      // Call the API route instead of invoking Lambda directly
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thumbnailImageFile,
          fullImageFile,
        }),
      });
  
      const data = await response.json();
      console.log(data, "data")
      if (response.ok) {
        console.log("Image uploaded successfully:", data);
        return data.result; // Lambda response
      } else {
        throw new Error(data.error || "Image upload failed.");
      }
    } catch (error) {
      console.error("Error during client image upload:", error);
      throw new Error("Failed to upload image.");
    }
  };
  