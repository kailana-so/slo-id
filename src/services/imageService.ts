import { invokeLambdaUpload } from "@/adapters/lambda";


interface UploadPayload {
    thumbnailImageFile: File;
    fullImageFile: File;
}

export const uploadClient = async (imageFiles: UploadPayload) => {
    const { thumbnailImageFile, fullImageFile} = imageFiles
    console.log(thumbnailImageFile, fullImageFile, "thumbnail, fullImage")
    try {
        // Prepare payload with image file and necessary metadata
        const payload: UploadPayload = {
            thumbnailImageFile,
            fullImageFile
        };

        // Call Lambda to handle the upload
        const lambdaResponse = await invokeLambdaUpload(payload);
        
        if (lambdaResponse?.status === 'success') {
            console.log('Image uploaded successfully:', lambdaResponse.data);
            return lambdaResponse.data;  // Return the URL or data of the uploaded file
        } else {
            throw new Error('Image upload failed.');
        }
    } catch (error) {
        console.error('Error during client image upload:', error);
        throw new Error('Failed to upload image to S3 via Lambda.');
    }
};
