"use client";

import { useEffect, useState } from "react";
import { FormSubmitEvent } from "@/types/form";
import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { Routes } from "@/enums/routes";
import { useRouter } from "next/navigation";
import { addSighting } from "@/services/identificationService";
import IdentificationForm from "@/components/forms/identification/IdentificationForm";
import { useProfile } from "@/providers/ProfileProvider";
import { uploadClient } from "@/services/imageService";
import { FormData, FormType, UploadPayload } from "@/types/note";


export default function TakeNote() {
    const { userData } = useProfile();
    const [formType, setFormType] = useState<FormType | "">("");
    const [formData, setFormData] = useState<FormData>({} as FormData);;
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()

    // Reset form data when formType changes
    useEffect(() => {
        setFormData({} as FormData);
    }, [formType]);

    const handleSubmit = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true);
        
      
        try {
            if (!userData) {
                console.warn("[handleSubmit] No user data found. Log in again");
                return;
            }
        
            const { imageFiles, ...rest } = formData;
            const noteData: FormData = {
                ...rest,
                type: formType,
                userId: userData.userId
            };
        
            if (imageFiles) {
                const imageResult = await uploadClient(imageFiles as UploadPayload, userData.userId);
                console.log(imageResult, "imageResult");
                noteData.imageId = imageResult.thumbnailKey.split("/").pop()?.split("_")[0];
            }

            console.log("[handleSubmit] noteData:", noteData)
      
            await addSighting(noteData);
            router.push(Routes.NOTES);
            
        } catch (error) {
            console.error("[TakeNote] Error taking note:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="card">
            <div className="pb-4">
            {Object.keys(identificationFormSchema).map((idType) => (
                <button
                    key={idType}
                    className={`badge-item ${formType === idType ? "selected" : "unselected"}`}
                    onClick={() => setFormType(idType as FormType)}
                >
                    {idType.charAt(0).toUpperCase() + idType.slice(1)}
                </button>
            ))}
            </div>
            {/* Render the form based on selected form type */}
            {formType && identificationFormSchema[formType] ? (
                <>
                    <IdentificationForm 
                        key={formType} 
                        schema={identificationFormSchema[formType]} 
                        handleSubmit={handleSubmit}
                        setFormData={setFormData}
                        loading={loading}
                        formData={formData}
                    />
                </>
            ) : (
                <div>
                    <p>Please select an ID type.</p>
                </div>
            )}
        </section>
    );
}
