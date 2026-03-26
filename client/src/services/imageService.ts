import { apiFetch } from "@/lib/api";
import { UploadPayload } from "@/types/note";

const uploadClient = async (imageFiles: UploadPayload, userId: string) => {
    const { thumbnailImageFile, fullImageFile } = imageFiles;
    if (!userId) return new Error("User not found");

    try {
        const response = await apiFetch("/api/upload/image", {
            method: "POST",
            body: JSON.stringify({
                user_id: userId,
                thumbnail_image_file: thumbnailImageFile.content,
                full_image_file: fullImageFile.content,
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
    const res = await apiFetch("/api/images/", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, filenames, image_type: imageType }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to fetch image URLs: ${error}`);
    }

    const { urls } = await res.json();
    return urls;
};

const presignUpload = async (
    userId: string,
    filename: string,
    mediaType: "video" | "audio",
    contentType: string,
): Promise<{ url: string; key: string }> => {
    const res = await apiFetch("/api/upload/presign", {
        method: "POST",
        body: JSON.stringify({
            user_id: userId,
            filename,
            media_type: mediaType,
            content_type: contentType,
        }),
    });
    if (!res.ok) throw new Error("Failed to get presigned URL");
    return await res.json();
};

const getSignedUrlsByKey = async (keys: string[]): Promise<Record<string, string>> => {
    if (keys.length === 0) return {};
    const res = await apiFetch("/api/images/keys", {
        method: "POST",
        body: JSON.stringify({ keys }),
    });
    if (!res.ok) throw new Error("Failed to fetch signed URLs");
    const { urls } = await res.json();
    return Object.fromEntries(urls.map((u: { key: string; url: string }) => [u.key, u.url]));
};

const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
    const res = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });
    if (!res.ok) throw new Error("S3 upload failed");
};

export { getImageURLs, getSignedUrlsByKey, uploadClient, presignUpload, uploadToS3 };
