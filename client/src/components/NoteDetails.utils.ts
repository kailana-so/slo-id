import { Note } from "@/types/note";
import { isDefined } from "@/types/typeGuards";
import { format } from "date-fns";

export const renderValue = (key: keyof Note, value: Note[keyof Note]) => {
    if (!isDefined(value)) return "";
    if (key === "createdAt" && typeof value === "number") return format(new Date(value), "dd MMM yyyy");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
};