import React, {useState} from "react";
import ActionButton from "@/components/common/ActionButton";
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import {
  IdentificationFormField,
  IdentificationFormProps,
} from "@/types/form";
import { safeValue } from "@/types/typeGuards";
import dynamic from "next/dynamic";
import { getEnvironmentalData } from "@/services/environmentService";
import { getCurrentUserGeolocation, getNearestIdentifiableLocation } from "@/services/locationService";
import Snackbar from "@/components/common/Snackbar";

const ImageSelector = dynamic(() => import('@/components/ImageSelector'), {
    ssr: false,
  });

const IdentificationForm: React.FC<IdentificationFormProps> = ({
  schema,
  handleSubmit,
  setFormData,
  formData,
  loading,
}) => {

    const [snackbar, setSnackbar] = useState({
        isOpen: false,
        message: "",
        type: "success" as "success" | "error",
      });

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

    const getLocationEnvironment = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (!isChecked) {
            // remove location/environment fields when toggled off
            setFormData((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { latitude, longitude, environment, location, ...rest } = prev;
              return rest;
            });
            setSnackbar({ isOpen: true, message: "Environmental data removed.", type: "success" });
            return;
        }
        // if checked, fetch
        try {
            const userLocation = await getCurrentUserGeolocation();

            console.log(userLocation, "USER LOCATION")
            const [environmentData, nearestILocation] = await Promise.all([
                getEnvironmentalData(userLocation.latitude, userLocation.longitude),
                getNearestIdentifiableLocation(userLocation.latitude, userLocation.longitude),
            ]);
        
            setFormData(prev => ({
                ...prev,
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                ...nearestILocation,
                ...environmentData,
            }));
        
            setSnackbar({ isOpen: true, message: "Environmental data added.", type: "success" });
        } catch (err) {
            setSnackbar({ isOpen: true, message: `Error: ${err}.`, type: "error" });
        }
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
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-row items-center">
                    <label className="flex items-center gap-1">
                        Enable Environmental Data 
                        <span
                            className="tooltip"
                            tabIndex={0}
                            aria-describedby="geo-tooltip"
                        >
                            <InfoOutlineIcon fontSize="small" aria-label="More info" />
                            <span
                                id="geo-tooltip"
                                role="tooltip"
                                className="tooltip-text"
                            >
                            Uses device location for accurate observations
                            </span>
                        </span>
                    </label>
                    <label className="switch ml-4">
                        <input type="checkbox" onChange={getLocationEnvironment} />
                        <span className="slider" />
                    </label>
                </div>
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
                <ImageSelector setFormData={setFormData} />
                <div className="pt-2 justify-items-end">
                    <ActionButton label="Mark" loading={loading} />
                </div>
            </form>
            {/* Local snackbar */}
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.isOpen}
                onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    );
};

export default IdentificationForm;
