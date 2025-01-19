"use client"; // Marking as a Client Component

import React, { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { UserDataProps } from "@/types/customTypes";
import PlantForm from "@/components/forms/PlantForm";  // Assuming you have PlantForm in your forms
import InsectForm from "@/components/forms/InsectForm";  // Assuming you have InsectForm in your forms

export default function TakeNote({ userData }: UserDataProps) {
    const [isPlant, setIsPlant] = useState<boolean>(false);
    const [isInsect, setIsInsect] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    console.log(userData, "userData");

    return (
        <>
            <div className="flex-row">
                <div>
                    <ActionButton label="Add geo" loading={loading}/>  
                </div>
                <div>
                    <p className="text-sm">*geolocation for climate and region data</p>
                </div>
            </div>
            <h3>ID Type</h3>
            <div className="space-x-3">
                <label>
                    <input
                        type="checkbox"
                        checked={isPlant}
                        onChange={(e) => {
                            setIsPlant(e.target.checked);
                            if (e.target.checked) setIsInsect(false); 
                        }}
                    />{" "}
                    Plant
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={isInsect}
                        onChange={(e) => {
                            setIsInsect(e.target.checked);
                            if (e.target.checked) setIsPlant(false);  
                        }}
                    />{" "}
                    Insect
                </label>
            </div>

            {/* Conditionally render PlantForm or InsectForm */}
            {isPlant && <PlantForm userData={userData}/>}
            {isInsect && <InsectForm userData={userData} />}
        </>
    );
}
