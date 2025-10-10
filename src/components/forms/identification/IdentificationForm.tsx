import React, {useEffect, useMemo, useState} from "react";
import ActionButton from "@/components/common/ActionButton";
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import {
  IdentificationFormProps,
} from "@/types/form";
import dynamic from "next/dynamic";
import { getEnvironmentalData } from "@/services/environmentService";
import { getCurrentUserGeolocation, getNearestIdentifiableLocation } from "@/services/locationService";
import Snackbar from "@/components/common/Snackbar";
import { getNoteSuggestions } from "@/services/generativeService";
import { Suggestion } from "@/types/suggestions";
import { renderFieldHelper } from "@/components/forms/identification/IdentificationForm.utils";
import SuggestionsDrawer from "@/components/SuggestionsDrawer";

const ImageSelector = dynamic(() => import('@/components/ImageSelector'), {
    ssr: false,
});


const IdentificationForm: React.FC<IdentificationFormProps> = ({
  schema,
  handleSubmit,
  setFormData,
  formData,
  loading,
  type
}) => {

    const [snackbar, setSnackbar] = useState({
        isOpen: false,
        message: "",
        type: "success" as "success" | "error",
      });
    const [suggestionDetails, setSuggestionDetails] = useState<Suggestion[]>([])
    const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false)
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Add suggestions to formData when they're fetched
    useEffect(() => {
        if (suggestionDetails.length > 0) {
            setFormData(prev => ({ ...prev, suggestions: suggestionDetails }));
        }
    }, [suggestionDetails, setFormData]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    const canSuggest = useMemo(() =>
        schema.every(f => {
          if (!f.required) return true;
          if (f.conditional && !formData[f.conditional]) return true; // gated field off
          const v = formData[f.name];
          return f.type === "checkbox" ? v === true : String(v ?? "").trim() !== "";
        }),
        [formData, schema]
      );


    const handleSuggestions = async (data: typeof formData) => {
        setSuggestionsLoading(true);
        
        try {
            const suggestions = await getNoteSuggestions(data, type);
            setSuggestionDetails(Array.isArray(suggestions) ? suggestions : []);
        } catch (err) {
            console.error("Failed to get suggestions:", err);
            setSuggestionDetails([{
                name: "sorry no suggestions found",
                native: false,
                characteristics: [],
                key_details: [],
            }]);
        } finally {
            setSuggestionsLoading(false);
            setDrawerOpen(true); 
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
                        {renderFieldHelper(field, formData, handleColorSelection, handleChange)}
                        </label>
                    </div>
                    ))}
                <ImageSelector setFormData={setFormData} />
                <div className="pt-2 justify-items-end">
                    <ActionButton label="Mark" loading={loading} />
                </div>
            </form>
            {/* Suggestions drawer and slider button */}
            <SuggestionsDrawer 
                suggestions={suggestionDetails} 
                isOpen={drawerOpen}
                isLoading={suggestionsLoading}
                canSuggest={canSuggest}
                suggestionsToggle={() => {
                    if (!drawerOpen) {
                        handleSuggestions(formData);
                    } else {
                        setDrawerOpen(false);
                    }
                }}
            />
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
