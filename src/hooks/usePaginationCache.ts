import { useInfiniteQuery } from "@tanstack/react-query";
import { getIdentifications, getSightings } from "@/services/identificationService";
import { getImageURLs } from "@/services/imageService";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Note } from "@/types/note";

export type NotesViewModel = {
    notes: Note[];
    thumbnails: Record<string, string>;
    lastDoc: QueryDocumentSnapshot | null;
    count: number;
    drafts: number;
};

export type IdsViewModel = {
    identifications: Note[];
    fullImages: Record<string, string>;
    lastDoc: QueryDocumentSnapshot | null;
    count: number;
};

export enum ImageType {
    FULL = "full",
    THUMBNAIL = "thumbnail"
}

export const usePaginatedNotes = (userId?: string) => {
    return useInfiniteQuery<NotesViewModel>({
        queryKey: ["paginatedNotes", userId],
        enabled: !!userId,
        initialPageParam: undefined as QueryDocumentSnapshot | undefined,
        queryFn: async ({ pageParam }) => {
        
        const cursor = pageParam as QueryDocumentSnapshot | undefined;
        const { notes, lastDoc, count, drafts} = await getSightings(userId!, cursor);

        const filenames = notes.map(n => n.imageId).filter((id): id is string => !!id);
        
        const imageUrls = await getImageURLs(userId!, filenames, ImageType.THUMBNAIL);
        const thumbnails = Object.fromEntries(
            imageUrls.map(({ filename, url }: { filename: string; url: string }) => [filename, url])
        );

        return { notes, thumbnails, lastDoc, count, drafts };
        },
        getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    });
};

export const usePaginatedIds = (userId?: string) => {
    return useInfiniteQuery<IdsViewModel>({
        queryKey: ["paginatedIds", userId],
        enabled: !!userId,
        initialPageParam: undefined as QueryDocumentSnapshot | undefined,
        queryFn: async ({ pageParam }) => {
        
        const cursor = pageParam as QueryDocumentSnapshot | undefined;
        const { identifications, lastDoc, count} = await getIdentifications(userId!, cursor);

        const filenames = identifications.map(id => id.imageId).filter((id): id is string => !!id);
        const imageUrls = await getImageURLs(userId!, filenames, ImageType.FULL);

        const fullImages = Object.fromEntries(
            imageUrls.map(({ filename, url }: { filename: string; url: string }) => [filename, url])
        );

        return { identifications, fullImages, lastDoc, count };
        },
        getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    });
};