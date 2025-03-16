import ActionButton from "@/components/common/ActionButton";
import ImageSelector from "@/components/ImageSelector";
import { OptionField, IdentificationFormField, IdentificationFormProps } from "@/types/customTypes";
import React, { useState } from "react";

const IdentificationForm: React.FC<IdentificationFormProps> = ({ 
    schema, 
    handleSubmit, 
    setFormData, 
    formData, 
    loading,
}) => {

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            const isChecked = target.checked;

            // Update the checkbox field
            setFormData((prev) => {
                const updatedFormData = {
                    ...prev,
                    [name]: isChecked,
                };
                // If unchecked, remove all dependent fields
                if (!isChecked) {
                    schema.forEach((field) => {
                        if (field.conditional === name) {
                            delete updatedFormData[field.name];
                        }
                    });
                }

                return updatedFormData;
            });
        } else {
            // Update other input types
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleColorSelection = (name: string, color: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: color,
        }));
    };

    const getLocationData = () => {
        navigator.geolocation.getCurrentPosition(
            function(position){
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;
                console.log("Latitude : "+latitude+" Longitude : "+longitude);
                formData["latitude"] = latitude
                formData["longitude"] = longitude
            },
            function(){
                alert("Geo Location not supported");
            }
        );      
    }

    const renderField = (field: IdentificationFormField) => {
        switch (field.type) {
            case "checkbox":
                return (
                    <label className="switch ml-4">
                        <input
                            type="checkbox"
                            name={field.name}
                            checked={!!formData[field.name]}
                            onChange={handleChange}
                        />
                        <span className="slider"></span>
                    </label>
                );
            case "select":
                return (
                    <select
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                    >
                        <option value=""></option>

                        {field.options?.map((option) => (
                            <option key={option.name} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                );
            case "color-buttons":
                return (
                    <div>
                        {field.options?.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                className={`color-box ${formData[field.name] === color.name ? "ring-highlight" : ""}`}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => handleColorSelection(field.name, color.name)}
                            />
                        ))}
                    </div>
                );
            default:
                return (
                    <input
                    className="ml-3"
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Filter schema to only show main fields or conditional fields when the condition is met */}
            {schema
                .filter((field) => !field.conditional || formData[field.conditional])
                .map((field) => (
                    <div
                        key={field.name}
                        className={field.conditional ? "ml-4" : ""} // Add margin for conditional fields
                    >
                        <label className="block mb-2">
                            {field.label}
                            {renderField(field)}
                        </label>
                    </div>
                ))}
            <div className="flex-row">
                <label className="block">
                    Get Geolocation
                    <label className="switch ml-4">
                        <input
                            type="checkbox"
                            // checked={!!formData[field.name]}
                            onChange={getLocationData}
                        />
                        <span className="slider"></span>
                    </label>
                </label>
            </div>
            <ImageSelector setFormData={setFormData}/>
            <div className="pt-2">
                <ActionButton label="Mark" loading={loading}/>
            </div>
        </form>
    );
};

export default IdentificationForm;
