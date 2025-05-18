import { Note } from "@/types/note";

export function hasGeoCoordinates(note: Note): note is Note & { latitude: number; longitude: number } {
  return typeof note.latitude === "number" && typeof note.longitude === "number";
}

export const isDefined = <T>(value: T | undefined | null): value is T => {
    return value !== undefined && value !== null;
};
  

export const safeValue = (value: unknown): string | number | "" => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return "";
  };
  