"use client"; // Marking as a Client Component
import React, { useEffect, useRef, useState } from "react";
import { getIdentificationNotes } from "@/services/identificationService";
import { useProfile } from "@/providers/ProfileProvider";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Note } from "@/types/types";
import Spinner from "@/components/common/Spinner";
import Image from 'next/image'
import { format } from 'date-fns';
import { fetchImageUrls } from "@/services/imageService";
import { NoteExtendedDetails } from "@/components/NoteDetails";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/routes";


export default function ViewNotes() {
    const { userData } = useProfile();
          
    const hasFetched = useRef(false);

    const router = useRouter();

    const [notes, setNotes] = useState<Note[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [thumbnailMap, setThumbnailMap] = useState<Record<string, string>>({});
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);


    if (!userData) {
      console.warn("No user data found. Log in again");
      return;
    }

    const getNotes = async (cursor?: QueryDocumentSnapshot) => {
        setLoading(true);
      
        try {
            const { notes: newNotes, lastDoc: newLastDoc } =
            await getIdentificationNotes(userData.user_id, cursor);
      
            setNotes(prev => [...prev, ...newNotes]);
            setLastDoc(newLastDoc);

            const filenames = newNotes
                .map(note => note.imageId)
                .filter(Boolean);
        
            let imageUrls = await fetchImageUrls(userData.user_id, filenames);           
            const imageUrlMap: Record<string, string> = Object.fromEntries(
                imageUrls.map(({ filename, url }: { filename: string; url: string }) => [filename, url])
            );
            setThumbnailMap(imageUrlMap)
            

        } catch (error) {
            console.error("[ViewNotes] Error getting notes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) {
            return
        } else {
            hasFetched.current = true;
        }
        
        getNotes();
    }, []);

    const handleClose = () => {
		setSelectedNote(null)
	}

    const handleRoute = () => {
		router.push(Routes.IDS); 
	};

    return (
        <div key='view-notes'>
            {notes.map((note) => (
                <div key={note.id} className={`card ${selectedNote?.id === note.id ? "card-selected": ""}`}>
                <section 
                    className="aligned content-center"
                    key={`${note.id}-${note.type}${note.createdAt}`}
                    onClick={() => setSelectedNote(note)}
                >
                    {thumbnailMap[note.imageId] && (
                        <Image
                            src={thumbnailMap[note.imageId]}
                            width={50}
                            height={50}
                            alt={`picture of ${note.name}`}
                        />
                    )}
                    <div>
                        <h4>{`${note.type}`}</h4>
                        <p key={`${note.type||"unknown"}-${note.createdAt}`}>
                            {note.createdAt ? format(note.createdAt, "dd MMM yyyy HH:mm a") : "No Date"}
                        </p>
                    </div>
                </section>
                {selectedNote?.id === note.id && (
                    <NoteExtendedDetails 
                        note={note} 
                        handleClose={handleClose}
                        handleRoute={handleRoute}/>
                )}
                </div>
            ))}
            <div className="pt-4 justify-items-center">
                <div>
                    {lastDoc && (
                        <button
                            type="submit" className="submit"
                            onClick={() => getNotes(lastDoc)}
                            disabled={loading}
                        >
                            {loading ? <Spinner/> : "Load More"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
