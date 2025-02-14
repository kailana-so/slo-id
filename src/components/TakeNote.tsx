"use client"; // Marking as a Client Component
import React, { useEffect, useReducer, useState } from "react";
import { FormSubmitEvent, FormType, UserDataProps } from "@/types/customTypes";
import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { Routes } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { addIdentificationNote } from "@/services/identificationService";
import IdentificationForm from "@/components/forms/identification/IdentificationForm";


export default function TakeNote({ userData }: UserDataProps) {
    const [formType, setFormType] = useState<FormType | "">("");
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState("");
    const router = useRouter()

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
            await addIdentificationNote(userData, formData);
            router.push(Routes.NOTES);
        } catch (error) {
            console.error("[TakeNote] Error taking note:", error);
        }
        setLoading(false)
    };

    return (
        <>
            <div className="grid grid-cols-3">
                {Object.keys(identificationFormSchema).map((idType) => (
                    <label key={idType} className="flex items-center">
                        <input
                            className="mr-2"
                            type="radio"
                            name="formType"
                            value={idType}
                            onChange={(e) => setFormType(e.target.value as FormType)}
                        />
                        {idType.charAt(0).toUpperCase() + idType.slice(1)}
                    </label>
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
                <p>Please select an ID type.</p>
            )}
        </>
    );
}
