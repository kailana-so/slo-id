import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { compressImage } from "@/lib/image/imageCompressor.client";
import { convertImage } from "@/lib/image/imageConverter.client";
import { uploadClient, presignUpload, uploadToS3 } from "@/services/imageService";
import { MediaItem, MediaType } from "@/types/note";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import CloseIcon from "@mui/icons-material/Close";

const MAX_PHOTOS = 3;

type PendingMedia = {
    id: string;
    mediaType: MediaType;
    previewUrl: string;     // object URL for display only
    file: File;
    uploading: boolean;
    uploaded?: MediaItem;   // set once upload is complete
};

type MediaSelectorProps = {
    userId: string;
    onChange: (media: MediaItem[]) => void;
};

export default function MediaSelector({ userId, onChange }: MediaSelectorProps) {
    const [items, setItems] = useState<PendingMedia[]>([]);
    const photoRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLInputElement>(null);

    const uploadedItems = (updated: PendingMedia[]) =>
        onChange(updated.filter(i => i.uploaded).map(i => i.uploaded!));

    const addPhoto = async (file: File) => {
        const id = uuidv4();
        const previewUrl = URL.createObjectURL(file);
        const pending: PendingMedia = { id, mediaType: MediaType.PHOTO, previewUrl, file, uploading: true };

        setItems(prev => {
            const next = [...prev, pending];
            return next;
        });

        try {
            const converted = await convertImage(file);
            const { fullImageFile, thumbnailImageFile } = await compressImage(converted, id);
            const result = await uploadClient({ fullImageFile, thumbnailImageFile }, userId);

            setItems(prev => {
                const next = prev.map(i =>
                    i.id === id
                        ? { ...i, uploading: false, uploaded: { key: result.full_key, media_type: MediaType.PHOTO, thumbnail_key: result.thumbnail_key } }
                        : i
                );
                uploadedItems(next);
                return next;
            });
        } catch {
            setItems(prev => prev.filter(i => i.id !== id));
            URL.revokeObjectURL(previewUrl);
        }
    };

    const addMedia = async (file: File, mediaType: typeof MediaType.VIDEO | typeof MediaType.AUDIO) => {
        const id = uuidv4();
        const previewUrl = URL.createObjectURL(file);
        const pending: PendingMedia = { id, mediaType, previewUrl, file, uploading: true };

        setItems(prev => [...prev, pending]);

        try {
            const { url, key } = await presignUpload(userId, file.name, mediaType, file.type);
            await uploadToS3(url, file);

            setItems(prev => {
                const next = prev.map(i =>
                    i.id === id
                        ? { ...i, uploading: false, uploaded: { key, media_type: mediaType } }
                        : i
                );
                uploadedItems(next);
                return next;
            });
        } catch {
            setItems(prev => prev.filter(i => i.id !== id));
            URL.revokeObjectURL(previewUrl);
        }
    };

    const remove = (id: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) URL.revokeObjectURL(item.previewUrl);
            const next = prev.filter(i => i.id !== id);
            uploadedItems(next);
            return next;
        });
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const photoCount = items.filter(i => i.mediaType === MediaType.PHOTO).length;
        const available = MAX_PHOTOS - photoCount;
        for (const file of files.slice(0, available)) {
            await addPhoto(file);
        }
        e.target.value = "";
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await addMedia(file, MediaType.VIDEO);
        e.target.value = "";
    };

    const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await addMedia(file, MediaType.AUDIO);
        e.target.value = "";
    };

    const photoCount = items.filter(i => i.mediaType === MediaType.PHOTO).length;
    const hasVideo   = items.some(i => i.mediaType === MediaType.VIDEO);
    const hasAudio   = items.some(i => i.mediaType === MediaType.AUDIO);

    return (
        <div className="space-y-3">
            {/* Previews */}
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                        <div key={item.id} className="relative">
                            {item.mediaType === MediaType.PHOTO && (
                                <img
                                    src={item.previewUrl}
                                    className="w-20 h-20 object-cover rounded-sm"
                                    alt="preview"
                                />
                            )}
                            {item.mediaType === MediaType.VIDEO && (
                                <video
                                    src={item.previewUrl}
                                    className="w-20 h-20 object-cover rounded-sm"
                                    muted
                                    playsInline
                                />
                            )}
                            {item.mediaType === MediaType.AUDIO && (
                                <div className="w-20 h-20 flex flex-col items-center justify-center rounded-sm bg-gray-100">
                                    <MicIcon />
                                    <audio src={item.previewUrl} controls className="w-full mt-1" style={{ height: 24 }} />
                                </div>
                            )}
                            {item.uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-sm">
                                    <div className="spinner" />
                                </div>
                            )}
                            {!item.uploading && (
                                <button
                                    type="button"
                                    className="absolute -top-1 -right-1 bg-white rounded-full"
                                    onClick={() => remove(item.id)}
                                >
                                    <CloseIcon fontSize="small" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
                {photoCount < MAX_PHOTOS && (
                    <button type="button" onClick={() => photoRef.current?.click()} title="Add photo">
                        <AddPhotoAlternateIcon />
                    </button>
                )}
                {!hasVideo && (
                    <button type="button" onClick={() => videoRef.current?.click()} title="Add video">
                        <VideocamIcon />
                    </button>
                )}
                {!hasAudio && (
                    <button type="button" onClick={() => audioRef.current?.click()} title="Add audio">
                        <MicIcon />
                    </button>
                )}
            </div>

            <input ref={photoRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={handlePhotoChange} />
            <input ref={videoRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleVideoChange} />
            <input ref={audioRef} type="file" accept="audio/*" capture className="hidden" onChange={handleAudioChange} />
        </div>
    );
}
