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
import { usePaginatedNotes } from "@/hooks/usePaginatedNotes";


export default function ViewNotes() {
    const { userData } = useProfile();
	const router = useRouter();
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error
	} = usePaginatedNotes(userData?.user_id);

	if (!userData) return null;
	if (isLoading) return <Spinner />;
	if (error) return (
        <div key="errro-getting-notes" className="card">
            <p>Error loading notes</p>
        </div>
    );

    console.log(data, "data")

	const allNotes = data?.pages.flatMap((p) => p.notes) ?? [];
    const allThumbnails = Object.assign({}, ...(data?.pages.map(p => p.thumbnails) ?? []));

    const handleSelectNote = (note: Note) => {
        
        setSelectedNote(note)
    }
 
    const handleClose = () => {
		setSelectedNote(null)
	}

    const handleRoute = () => {
		router.push(Routes.IDS); 
	};

    return (
        <div key='view-notes'>
            {allNotes.map((note) => (
                <div key={note.id} className={`card ${selectedNote?.id === note.id ? "card-selected": ""}`}>
                <section 
                    className="aligned content-center"
                    key={`${note.id}-${note.type}${note.createdAt}`}
                    onClick={() => handleSelectNote(note)}
                >
                    {allThumbnails[note.imageId] && (
                        <Image
                            src={allThumbnails[note.imageId]}
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
            {hasNextPage && (
				<div className="pt-4 justify-items-center">
					<button className="submit" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
						{isFetchingNextPage ? <Spinner /> : "Load More"}
					</button>
				</div>
			)}
        </div>
    );
}
