import { apiFetch } from "@/lib/api";
import { MapPin } from "@/types/map";
import { Note, NoteCreate, NoteUpdate, SightingStatus } from "@/types/note";

const PAGE_SIZE = 10;

type GetNotesResult = {
    notes: Note[];
    count: number;
    drafts: number;
    page: number;
};

type GetIdentificationsResult = {
    identifications: Note[];
    count: number;
    page: number;
};

type GetMapPinsResult = {
    notes: MapPin[];
};

const addSighting = async (sighting: NoteCreate): Promise<Note | null> => {
    try {
        const res = await apiFetch("/api/sightings/", {
            method: "POST",
            body: JSON.stringify(sighting),
        });
        if (!res.ok) throw new Error("Failed to create sighting");
        return await res.json();
    } catch (error) {
        console.error("[addSighting]", error);
        return null;
    }
};

const updateSightingStatus = async (noteId: string, status: string): Promise<void> => {
    try {
        await apiFetch(`/api/sightings/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
    } catch (error) {
        console.error("[updateSightingStatus]", error);
    }
};

const updateSightingLocation = async (
    noteId: string,
    latitude: number,
    longitude: number,
): Promise<void> => {
    try {
        const { getNearestIdentifiableLocation } = await import("@/services/locationService");
        const { location } = await getNearestIdentifiableLocation(latitude, longitude);
        await apiFetch(`/api/sightings/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify({ latitude, longitude, location }),
        });
    } catch (error) {
        console.error("[updateSightingLocation]", error);
        throw error;
    }
};

const updateSightingFields = async (
    noteId: string,
    fieldUpdates: Record<string, string | boolean>,
): Promise<void> => {
    try {
        await apiFetch(`/api/sightings/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify({ fields: fieldUpdates }),
        });
    } catch (error) {
        console.error("[updateSightingFields]", error);
        throw error;
    }
};

const updateSighting = async (noteId: string, updates: NoteUpdate): Promise<void> => {
    try {
        await apiFetch(`/api/sightings/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
    } catch (error) {
        console.error("[updateSighting]", error);
        throw error;
    }
};

const getSightings = async (page = 1): Promise<GetNotesResult> => {
    try {
        const res = await apiFetch(`/api/sightings/?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch sightings");

        const data = await res.json();
        const notes: Note[] = data.sightings.filter(
            (n: Note) => n.status === SightingStatus.SIGHTING || n.status === SightingStatus.DRAFT,
        );
        const drafts = notes.filter((n) => n.status === SightingStatus.DRAFT).length;

        return { notes, count: data.count, drafts, page: data.page };
    } catch (error) {
        console.error("[getSightings]", error);
        return { notes: [], count: 0, drafts: 0, page: 1 };
    }
};

const getIdentifications = async (page = 1): Promise<GetIdentificationsResult> => {
    try {
        const res = await apiFetch(`/api/sightings/?status=identification&page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch identifications");

        const data = await res.json();
        return { identifications: data.sightings, count: data.count, page: data.page };
    } catch (error) {
        console.error("[getIdentifications]", error);
        return { identifications: [], count: 0, page: 1 };
    }
};

const getUserSightingsCoords = async (): Promise<GetMapPinsResult> => {
    try {
        const res = await apiFetch("/api/sightings/map");
        if (!res.ok) throw new Error("Failed to fetch map pins");
        const data = await res.json();
        return { notes: data.pins };
    } catch (error) {
        console.error("[getUserSightingsCoords]", error);
        return { notes: [] };
    }
};

const getNearbyUserSightings = async (
    latitude: number,
    longitude: number,
    radiusKm = 2,
): Promise<GetMapPinsResult> => {
    try {
        const res = await apiFetch(
            `/api/sightings/nearby?lat=${latitude}&lng=${longitude}&radius_km=${radiusKm}`,
        );
        if (!res.ok) throw new Error("Failed to fetch nearby sightings");
        const data = await res.json();
        return { notes: data.sightings };
    } catch (error) {
        console.error("[getNearbyUserSightings]", error);
        return { notes: [] };
    }
};

const deleteSighting = async (noteId: string): Promise<boolean> => {
    try {
        const res = await apiFetch(`/api/sightings/${noteId}`, { method: "DELETE" });
        return res.ok;
    } catch (error) {
        console.error("[deleteSighting]", error);
        return false;
    }
};

export {
    addSighting,
    getSightings,
    getUserSightingsCoords,
    getNearbyUserSightings,
    updateSightingStatus,
    updateSightingLocation,
    updateSightingFields,
    updateSighting,
    getIdentifications,
    deleteSighting,
    PAGE_SIZE,
};
