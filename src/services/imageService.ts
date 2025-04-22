import { commonHeaders } from "@/lib/commonHeaders";

interface UploadImage {
	name: string;
	type: string;
	content: string; 
}
  
interface UploadPayload {
	thumbnailImageFile: UploadImage;
	fullImageFile: UploadImage;
}
  
const uploadClient = async (
	imageFiles: UploadPayload,
	userId: string,
) => {
	const { thumbnailImageFile, fullImageFile } = imageFiles;
	if (!userId) return new Error("User not found");
	
	try {
		const response = await fetch("/api/uploadImage", {
		method: "POST",
		headers: { 
			"Content-Type": "application/json",
			...commonHeaders()
			
		},
		body: JSON.stringify({
			userId,
			thumbnailImageFile: thumbnailImageFile.content,
			fullImageFile: fullImageFile.content,
		}),
		});
	
		const data = await response.json();
		if (response.ok) return data.result;
	
		throw new Error(data.error || "Image upload failed.");
	} catch (error) {
		console.error("Error during client image upload:", error);
		throw new Error("Failed to upload image.");
	}
};
	  

const getImageURLs = async (
	userId: string,
	filenames: string[],
	imageType: string,
): Promise<{ filename: string; url: string }[]> => {

	const res = await fetch("/api/images", {
		method: "POST",
		headers: { 
			"Content-Type": "application/json",
			...commonHeaders()
		},
		body: JSON.stringify({ userId, filenames, imageType }),
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Failed to fetch image URLs: ${error}`);
	}

	const { urls } = await res.json();
	return urls;
};

  
export { getImageURLs, uploadClient}