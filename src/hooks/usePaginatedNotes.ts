import { useInfiniteQuery } from "@tanstack/react-query";
import { getIdentificationNotes } from "@/services/identificationService";
import { fetchImageUrls } from "@/services/imageService";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Note } from "@/types/types";

export type NotesViewModel = {
    notes: Note[];
    thumbnails: Record<string, string>;
    lastDoc: QueryDocumentSnapshot | null;
};
  

export const usePaginatedNotes = (userId?: string) => {
    return useInfiniteQuery<NotesViewModel>({
        queryKey: ["paginatedNotes", userId],
        enabled: !!userId,
        initialPageParam: undefined as QueryDocumentSnapshot | undefined,
        queryFn: async ({ pageParam }) => {
        
        const cursor = pageParam as QueryDocumentSnapshot | undefined;
        const { notes, lastDoc } = await getIdentificationNotes(userId!, cursor);

        const filenames = notes.map(n => n.imageId).filter(Boolean);
        const imageUrls = await fetchImageUrls(userId!, filenames);

        const thumbnails = Object.fromEntries(
            imageUrls.map(({ filename, url }: { filename: string; url: string }) => [filename, url])
        );

        return { notes, thumbnails, lastDoc };
        },
        getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    });
};
