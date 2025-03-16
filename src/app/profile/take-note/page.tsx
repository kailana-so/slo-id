"use client"; // Marking as a Client Component
import React, { useEffect, useReducer, useState } from "react";
import { FormSubmitEvent, FormType } from "@/types/customTypes";
import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { Routes } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { addIdentificationNote } from "@/services/identificationService";
import IdentificationForm from "@/components/forms/identification/IdentificationForm";
import { useProfile } from "@/providers/ProfileProvider";
import { uploadClient } from "@/services/imageService";
import ActionButton from "@/components/common/ActionButton";
import MenuItem from "@/components/common/MenuItem";


export default function TakeNote() {
    const { userData } = useProfile();
    const [formType, setFormType] = useState<FormType | "">("");
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()

    console.log(formData.imageFiles, "imageFiles")

    // Reset form data when formType changes
    useEffect(() => {
        setFormData({});
    }, [formType]);

    const handleSubmit = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true)
        formData["type"] = formType
        console.log(`[TakeNote] ${formType} data`, formData);
        try {
            if (userData) {
                console.warn("No user data found. Log in again");
                if(formData.imageFiles) {
                    let imageResult = await uploadClient(formData.imageFiles)
                    console.log(imageResult, "imageResult")
                }

                await addIdentificationNote(userData, formData);
                // router.push(Routes.NOTES);
                return;
            }
        } catch (error) {
            console.error("[TakeNote] Error taking note:", error);
        }
        setLoading(false)
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
