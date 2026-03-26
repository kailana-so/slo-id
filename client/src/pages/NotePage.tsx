import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import IdentificationForm from "@/components/forms/identification/IdentificationForm";
import MediaSelector from "@/components/MediaSelector";
import Snackbar from "@/components/common/Snackbar";
import { addSighting, updateSightingFields } from "@/services/identificationService";
import { useProfile } from "@/providers/ProfileProvider";
import { Routes } from "@/enums/routes";

import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { groups, type TopGroup } from "@/types/groups";
import type { FormType } from "@/types/groups";
import type { FormData, MediaItem } from "@/types/note";
import type { LocationData } from "@/types/map";
import type { EnvironmentalData } from "@/types/environment";

type SnackbarState = {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
};

// Keys in formData that belong to NoteCreate (not species fields)
const GEO_KEYS = new Set(["latitude", "longitude", "location", "environment"]);

export default function NotePage() {
  const { userData } = useProfile();
  const navigate = useNavigate();

  // media-first state
  const [media, setMedia] = useState<MediaItem[]>([]);

  // chip state
  const [top, setTop] = useState<TopGroup | null>(null);
  const [formType, setFormType] = useState<FormType | "">("");

  // form state
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const handleClose = () => navigate(Routes.NOTES);

  const subTypes = useMemo(
    () => (top ? groups.find(g => g.name === top)?.types ?? [] : []),
    [top]
  );

  useEffect(() => {
    setFormData({} as FormData);
    if (!top) return setFormType("");
    if (subTypes.length === 1) {
      setFormType(subTypes[0]?.id || "");
    } else {
      setFormType("");
    }
  }, [top, subTypes.length, subTypes]);

  useEffect(() => {
    setFormData({} as FormData);
  }, [formType]);

  const resolvedSchema = useMemo(() => {
    if (!formType) return null;
    const fields = [...identificationFormSchema[formType]];

    const vertebrates = new Set<FormType>(["bird", "reptile", "mammal", "amphibian", "fish"]);
    const arachnids = new Set<FormType>(["arachnid"]);
    if (!vertebrates.has(formType) && !arachnids.has(formType)) return fields;

    return fields.map(f =>
      f.name === "lifeStage" && Array.isArray(f.options)
        ? { ...f, options: [{ name: "juvenile" }, { name: "adult" }] }
        : f
    );
  }, [formType]);

  const save = async () => {
    if (!userData) {
      console.warn("[save] No user data found.");
      return;
    }
    setLoading(true);
    try {
      // Separate geo fields from species-specific enrichment fields
      const fields: Record<string, string | boolean> = {};
      let latitude: number | undefined;
      let longitude: number | undefined;
      let location: LocationData | undefined;
      let environment: EnvironmentalData | undefined;

      for (const [key, value] of Object.entries(formData)) {
        if (key === "_topGroup") continue;
        if (GEO_KEYS.has(key)) {
          if (key === "latitude") latitude = value as number;
          else if (key === "longitude") longitude = value as number;
          else if (key === "location") location = value as LocationData;
          else if (key === "environment") environment = value as EnvironmentalData;
        } else {
          fields[key] = value as string | boolean;
        }
      }

      const note = await addSighting({
        type: formType as import("@/types/note").FormType || undefined,
        media,
        latitude,
        longitude,
        location,
        environment,
      });

      if (note && Object.keys(fields).length > 0) {
        await updateSightingFields(note.id, fields);
      }

      setSnackbar({ isOpen: true, message: "Noted", type: "success" });
    } catch (error) {
      console.error("[NotePage] Error:", error);
      setSnackbar({ isOpen: true, message: `Failed to add note. ${error}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save();
  };

  return (
    <>
      <section className="card">
        {/* Media — always visible, upload happens before form submission */}
        <div className="pb-4">
          {userData && (
            <MediaSelector userId={userData.id} onChange={setMedia} />
          )}
        </div>

        {/* Row 1: Top-group chips */}
        <div className="pb-4 flex flex-wrap gap-2">
          {groups.map(g => (
            <button
              key={g.id}
              className={`badge-item ${top === g.name ? "selected" : "unselected"}`}
              onClick={() => setTop(g.name)}
              type="button"
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Row 2: Sub-group chips (only when multiple) */}
        {top && subTypes.length > 1 && (
          <div className="pb-4 flex flex-wrap gap-2">
            {subTypes.map(({ id, name }) => (
              <button
                key={id}
                className={`badge-sub-item ${formType === id ? "selected" : "unselected"}`}
                onClick={() => setFormType(id)}
                type="button"
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Enrichment form — optional, shown once a species type is selected */}
        {formType && resolvedSchema ? (
          <IdentificationForm
            key={formType}
            schema={resolvedSchema}
            handleSubmit={handleSubmit}
            setFormData={setFormData}
            loading={loading}
            formData={formData}
            setSnackbar={setSnackbar}
            type={formType}
          />
        ) : (
          <div className="pt-2">
            <p className="text-sm text-gray-500">
              Select a category to add species details, or{" "}
              <button
                type="button"
                className="underline"
                onClick={save}
                disabled={loading || media.length === 0}
              >
                save as sighting
              </button>
              .
            </p>
          </div>
        )}
      </section>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={handleClose}
      />
    </>
  );
}
