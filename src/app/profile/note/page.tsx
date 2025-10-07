"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import IdentificationForm from "@/components/forms/identification/IdentificationForm";
import Snackbar from "@/components/common/Snackbar";
import { addSighting } from "@/services/identificationService";
import { uploadClient } from "@/services/imageService";
import { useProfile } from "@/providers/ProfileProvider";
import { Routes } from "@/enums/routes";

import { identificationFormSchema} from "@/components/forms/identification/IdentificationFormSchema";
import { groups, type TopGroup } from "@/types/groups";
import type { FormType } from "@/types/groups";
import type { FormData, UploadPayload } from "@/types/note";
// import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
// import { getNoteSuggestions } from "@/services/generativeService"



type snackbarProps = {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
  onclose?: () => void;
};

export default function TakeNote() {
  const { userData } = useProfile();
  const router = useRouter();

  // chip state
  const [top, setTop] = useState<TopGroup | null>(null);
  const [formType, setFormType] = useState<FormType | "">("");

  // form state
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<snackbarProps>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const handleClose = () => router.push(Routes.NOTES);

  // current subgroup list (ids + labels) from groups
  const subTypes = useMemo(
    () => (top ? groups.find(g => g.name === top)?.types ?? [] : []),
    [top]
  );

  // when top changes: auto-pick only subtype (Plant/Fungus) else wait for sub click
  useEffect(() => {
    setFormData({} as FormData);
    if (!top) return setFormType("");

    if (subTypes.length === 1) {
      setFormType(subTypes[0]?.id || "");
    } else {
      setFormType("");
    }
  }, [top, subTypes.length, subTypes]);

  // reset form values when formType changes
  useEffect(() => {
    setFormData({} as FormData);
  }, [formType]);

  // optional: thin lifeStage for vertebrates/arachnids
  const resolvedSchema = useMemo(() => {
    if (!formType) return null;
    const fields = [...identificationFormSchema[formType]]; // mutable copy

    const vertebrates = new Set<FormType>(["bird", "reptile", "mammal", "amphibian", "fish"]);
    const arachnids = new Set<FormType>(["arachnid"]);
    if (!vertebrates.has(formType) && !arachnids.has(formType)) return fields;

    return fields.map(f =>
      f.name === "lifeStage" && Array.isArray(f.options)
        ? { ...f, options: [{ name: "juvenile" }, { name: "adult" }] }
        : f
    );
  }, [formType]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!userData) {
        console.warn("[handleSubmit] No user data found.");
        return;
      }

      const { imageFiles, ...rest } = formData;
      const noteData: FormData = {
        ...rest,
        type: formType,
        userId: userData.userId,
        _topGroup: top ?? "",
      };

      if (imageFiles) {
        const imageResult = await uploadClient(imageFiles as UploadPayload, userData.userId);
        noteData.imageId = imageResult.thumbnailKey.split("/").pop()?.split("_")[0];
      }

      await addSighting(noteData);
      setSnackbar({
        isOpen: true,
        message: `Noted`,
        type: "success",
      });
    } catch (error) {
      console.error("[TakeNote] Error:", error);
      setSnackbar({ isOpen: true, message: `Failed to add note. ${error}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="card">
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

        {/* Form */}
        {formType && resolvedSchema ? (
          <>
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
          </>
        ) : (
          <div><p>Please select a category.</p></div>
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
