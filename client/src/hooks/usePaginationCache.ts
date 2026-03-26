import { useInfiniteQuery } from "@tanstack/react-query";
import { getIdentifications, getSightings } from "@/services/identificationService";
import { Note } from "@/types/note";

export type NotesViewModel = {
    notes: Note[];
    count: number;
    drafts: number;
    page: number;
};

export type IdsViewModel = {
    identifications: Note[];
    count: number;
    page: number;
};

export const usePaginatedNotes = (userId?: string) => {
    return useInfiniteQuery<NotesViewModel>({
        queryKey: ["paginatedNotes", userId],
        enabled: !!userId,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = pageParam as number;
            const { notes, count, drafts } = await getSightings(page);
            return { notes, count, drafts, page };
        },
        getNextPageParam: (lastPage) => {
            const loaded = lastPage.page * 10;
            return loaded < lastPage.count ? lastPage.page + 1 : undefined;
        },
    });
};

export const usePaginatedIds = (userId?: string) => {
    return useInfiniteQuery<IdsViewModel>({
        queryKey: ["paginatedIds", userId],
        enabled: !!userId,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = pageParam as number;
            const { identifications, count } = await getIdentifications(page);
            return { identifications, count, page };
        },
        getNextPageParam: (lastPage) => {
            const loaded = lastPage.page * 10;
            return loaded < lastPage.count ? lastPage.page + 1 : undefined;
        },
    });
};
