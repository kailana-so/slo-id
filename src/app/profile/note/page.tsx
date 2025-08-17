"use client";

import { useEffect, useState } from "react";
import { FormSubmitEvent } from "@/types/form";
import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { useRouter } from "next/navigation";
import { addSighting } from "@/services/identificationService";
import IdentificationForm from "@/components/forms/identification/IdentificationForm";
import { useProfile } from "@/providers/ProfileProvider";
import { uploadClient } from "@/services/imageService";
import { FormData, FormType, UploadPayload } from "@/types/note";
import Snackbar from "@/components/common/Snackbar";
import { Routes } from "@/enums/routes";

type snackbarProps = { 
    isOpen: boolean; 
    message: string; 
    type: 'success' | 'error' 
    onclose?: () => void
}

export default function TakeNote() {
    const { userData } = useProfile();
    const [formType, setFormType] = useState<FormType | "">("");
    const [formData, setFormData] = useState<FormData>({} as FormData);;
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<snackbarProps>({
        isOpen: false,
        message: '',
        type: 'success',
    });

    const router = useRouter()

    const handleClose = () => {
        router.push(Routes.NOTES)
    }

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
                noteData.imageId = imageResult.thumbnailKey.split("/").pop()?.split("_")[0];
            }
      
            await addSighting(noteData);
            setSnackbar({ isOpen: true, message: `Note created with data: ${JSON.stringify(noteData)}`, type: 'success'});
          
            
        } catch (error) {
            console.error("[TakeNote] Error taking note:", error);
            setSnackbar({ isOpen: true, message: 'Failed to add note. Please try again.', type: 'error'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                            setSnackbar={setSnackbar}
                        />
                    </>
                ) : (
                    <div>
                        <p>Please select an ID type.</p>
                    </div>
                )}
            </section>
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.isOpen}
                onClose={() => handleClose()}
            />
        </>
    );
}
