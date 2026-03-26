import { isDefined } from "@/types/typeGuards";

export const renderValue = (_key: string, value: unknown) => {
    if (!isDefined(value)) return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
};
