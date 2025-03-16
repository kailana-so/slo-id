import { database, auth } from "@/adapters/firebase";
import { IdentificationFormProps, ProfileProps, UserProps } from "@/types/customTypes";
import { setDoc, doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { timestampFields } from "../enums/enums";

const addIdentificationNote = async (
    userData: ProfileProps,
    noteData: Record<string, any>
) => {
    noteData[timestampFields.CREATED_AT] = Date.now();
    console.log(`[addIdentificationNote] Adding Note to DB with payload`, noteData)

    try {
        // Reference the "notes" subcollection inside each user's document
        const userIdentificationsRef = collection(
            database, 
            "identifications", 
            userData.user_id, 
            "notes"
        );
        // Add a new document (Firestore auto-generates an Id)
        const docRef = await addDoc(userIdentificationsRef, noteData);
        console.log(`[addIdentificationNote] Note added with id: ${docRef.id} for user: ${userData.username}`)
    } catch (error) {
        console.error("Error adding user note: ", error);
    }
};

const getIdentificationNotes = async (
    userId: string,
) => {
    try {
        const notesRef = collection(database, "identifications", userId, "notes");

        // Fetch all notes in the "notes" subcollection
        const notesSnapshot = await getDocs(notesRef);

        // Convert Firestore documents to an array of objects
        const notes = notesSnapshot.docs.map(doc => ({
            id: doc.id, // Include document ID
            ...doc.data() // Spread document data
        }));

        console.log("Fetched Notes:", notes);
        return notes;
    } catch (error) {
        console.error("Error fetching identification notes:", error);
        return [];
    }
};

export {
    addIdentificationNote,
    getIdentificationNotes
};
