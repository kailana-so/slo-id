"use client"; // Marking as a Client Component
import React, { useEffect, useState } from "react";
import { UserDataProps } from "@/types/customTypes";
import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { useRouter } from "next/navigation";
import { getIdentificationNotes } from "@/services/identificationService";
import { useAuth } from "@/providers/AuthProvider";
import { getUser } from "@/services/userService";
import { useProfile } from "@/providers/ProfileProviders";


interface Note {
    name?: string; // Optional since not all notes might have it
    createdAt?: number;
    [key: string]: any; // Allows any additional keys
}

export default function ViewNotes() {
    const { userData } = useProfile();
    const [notes, setNotes] = useState<Note[]>([]);

    const getNotes = async () => {
        if (!userData) {
            console.warn("No user data found. Log in again");
            return;
        }
        try {
            const userNotes = await getIdentificationNotes(userData.user_id)
            setNotes(userNotes)
        } catch (error) {
            console.error("[ViewNotes] Error getting notes:", error);
        }
    }
    useEffect(() => {
        getNotes()
    }, []);


    return (
        <div key='view-notes'>
            {notes.map((note) => (
                <>
                    <h4>{`[${note.type}]`}</h4>
                    <p key={`${note.type||"unknown"}-${note.createdAt}`}>
                        {`${note.name||"unknown"}`} seen at {note.createdAt ? new Date(note.createdAt).toLocaleString() : "No Date"}
                    </p>
                    <hr></hr>
                </>
            ))}
        </div>
    );
}
