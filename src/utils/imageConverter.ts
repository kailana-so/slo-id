import heic2any from "heic2any";

export const convertImage = async (file: File) => {
  if (file.type === "image/heic" || file.name.endsWith(".heic")) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      });

      return new File([convertedBlob as Blob], file.name.replace(".heic", ".jpg"), {
        type: "image/jpeg",
      });
    } catch (error) {
      console.error("Error converting to HEIC:", error);
      return file;
    }
  }
  return file;
};
