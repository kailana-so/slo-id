import { collection, doc } from "firebase/firestore";
import { database } from "../adapters/firebase.client";

export const sightingsCollection = () => collection(database, "sightings");
export const sightingsDoc = (sightingId: string) => doc(database, "sightings", sightingId);
export const usersCollection = (userId: string) => collection(database, "users", userId);

export enum DocumentTimestamp {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    DELETED_AT = "deletedAt",
}

export enum SightingStatus {
    DRAFT = "draft",
    SIGHTING = "sighting",
    IDENTIFICATION = "identification",
}

export const SightingFields = {
    Status: "status",
    CreatedAt: "createdAt",
    Type: "type",
    UserId: "userId",
} as const;