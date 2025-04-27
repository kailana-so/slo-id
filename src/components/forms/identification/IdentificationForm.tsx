import React from "react";
import ActionButton from "@/components/common/ActionButton";
import ImageSelector from "@/components/ImageSelector";
import {
  IdentificationFormField,
  IdentificationFormProps,
} from "@/types/form";
import { safeValue } from "@/types/typeGuards";
import InfoIcon from "@/components/common/infoIcon";

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
        return handleCheckboxChange(name, target.checked);
    }

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleCheckboxChange = (name: string, isChecked: boolean) => {
        setFormData((prev) => {
        const updated = { ...prev, [name]: isChecked };

        if (!isChecked) {
            schema.forEach((field) => {
            if (field.conditional === name) delete updated[field.name];
            });
        }

        return updated;
        });
    };

    const handleColorSelection = (name: string, color: string) => {
        setFormData((prev) => ({
        ...prev,
        [name]: color,
        }));
    };

    const getLocationData = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setFormData((prev) => ({
                ...prev,
                latitude,
                longitude,
                }));
            },
            () => {
                alert("Geolocation not supported or denied.");
            }
        );
        //  grab weather infomation
    };

    const renderField = (field: IdentificationFormField) => {
        const value = formData[field.name];

        switch (field.type) {
        case "checkbox":
            return (
            <label className="switch ml-4">
                <input
                type="checkbox"
                name={field.name}
                checked={!!value}
                onChange={handleChange}
                />
                <span className="slider" />
            </label>
            );

        case "select":
            return (
            <select
                name={field.name}
                required={field.required}
                value={safeValue(value)}
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
                    className={`color-box ${
                        value === color.name ? "ring-highlight" : ""
                    }`}
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
                value={safeValue(value)}
                onChange={handleChange}
            />
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {schema
                .filter((field) => !field.conditional || formData[field.conditional])
                .map((field) => (
                <div key={field.name} className={field.conditional ? "ml-4" : ""}>
                    <label className="block mb-2">
                    {field.label}
                    {renderField(field)}
                    </label>
                </div>
                ))}

            <div className="flex-row">
                <label className="block">
                    Get location data <InfoIcon></InfoIcon>
                <label className="switch ml-4">
                    <input type="checkbox" onChange={getLocationData} />
                    <span className="slider" />
                </label>
                </label>
            </div>

            <ImageSelector setFormData={setFormData} />
            <div className="pt-2 justify-items-end">
                <ActionButton label="Mark" loading={loading} />
            </div>
        </form>
    );
};

export default IdentificationForm;
