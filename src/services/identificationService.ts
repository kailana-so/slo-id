import { database } from "@/adapters/firebase";
import { ProfileProps, Note, NotePin } from "@/types/types";
import { collection, addDoc, getDocs, orderBy, query, limit, startAfter, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { timestampFields } from "../enums/enums";

type GetNotesResult = {
    notes: Note[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};
type GetNotePinsResult = {
    notes: NotePin[];
};

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
    lastDoc?: QueryDocumentSnapshot
): Promise<GetNotesResult> => {
    try {
        const notesRef = collection(database, "identifications", userId, "notes");
        const PAGE_SIZE = 6;

        const constraints = [
            orderBy("createdAt", "desc"),
            ...(lastDoc ? [startAfter(lastDoc.get("createdAt"))] : []),
            limit(PAGE_SIZE)
        ];

        const notesQuery = query(notesRef, ...constraints);
        const snapshot = await getDocs(notesQuery);

        const notes: Note[] = snapshot.docs
            .map(doc => {
                const data = doc.data();
                    if (!data.type) {
                    console.warn("Skipping note with missing 'type'", data);
                    return null;
                }

                return {
                    id: doc.id,
                    ...data,
                } as Note;
            })
            .filter((note): note is Note => note !== null);


        const lastVisible = snapshot.docs.at(-1) ?? null;

        return { notes, lastDoc: lastVisible };
    } catch (error) {
        console.error("Error fetching notes:", error);
        return { notes: [], lastDoc: null };
    }
};

const getNotesLocations = async (
    userId: string
  ): Promise<GetNotePinsResult> => {
    try {
      const notesRef = collection(database, "identifications", userId, "notes");
      const snapshot = await getDocs(notesRef);
  
      const notes: NotePin[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (
            typeof data.latitude !== "number" ||
            typeof data.longitude !== "number" ||
            typeof data.createdAt !== "number"
          ) return null;
  
          return {
            id: doc.id,
            latitude: data.latitude,
            longitude: data.longitude,
            createdAt: data.createdAt,
            name: data.name,
          };
        })
        .filter(Boolean) as NotePin[];
  
      return { notes };
    } catch (error) {
      console.error("Error fetching notes with location:", error);
      return { notes: [] };
    }
};
   

export {
    addIdentificationNote,
    getIdentificationNotes,
    getNotesLocations
};
