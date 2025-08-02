"use client"; 
import React, {  useState } from "react";
import { useProfile } from "@/providers/ProfileProvider";
import { Note } from "@/types/note";
import Spinner from "@/components/common/Spinner";
import Image from 'next/image'
import { format } from 'date-fns';
import { NoteExtendedDetails } from "@/components/NoteDetails";
import { usePaginatedNotes } from "@/hooks/usePaginationCache";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/navigation";
import { Routes } from "@/enums/routes";
import { updateSighting } from "@/services/identificationService";
import { sentenceCase } from "@/utils/helpers";

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
	} = usePaginatedNotes(userData?.userId);

	if (!userData) return null;
	if (isLoading) return <Spinner />;
	if (error) return (
        <div key="error-getting-notes" className="card">
            <p>Error loading notes</p>
        </div>
    );

    console.log(data, "data")

	const allNotes = data?.pages.flatMap(page => page.notes) ?? [];
    const totalCount = data?.pages[0]?.count ?? 0;
    const drafts = data?.pages[0]?.drafts ?? 0;
    const allThumbnails = Object.assign({}, ...(data?.pages.map(p => p.thumbnails) ?? []));
    const validFetchMore = allNotes.length < totalCount
    console.log(drafts, "drafts")
    const handleClose = () => {
		setSelectedNote(null)
	}

    const handleIdentify = async (noteId: string) => {
        console.log("[handleIdentify] note id:", noteId)

        await updateSighting(noteId)
        router.push(Routes.IDS);
    };

    return (
        <div key='view-notes'>
            {allNotes.map((note) => (
                <div key={note.id} className={`card`}>
                <section 
                    className="aligned content-center"
                    key={`${note.id}-${note.type}${note.createdAt}`}
                    onClick={() => setSelectedNote(note)}
                >
                    {note.imageId && allThumbnails[note.imageId] && (
                        <Image
                            src={allThumbnails[note.imageId]}
                            width={50}
                            height={50}
                            alt={`picture of ${note.name}`}
                            className="object-cover rounded-sm" 
                        />
                    )}
                    <div>
                        <h4>{`${sentenceCase(note.type)}`}</h4>
                        <p key={`${note.type||"unknown"}-${note.createdAt}`}>
                            {note.createdAt ? format(note.createdAt, "dd MMM yyyy HH:mm a") : "No Date"}
                        </p>
                        <p key={`${note.type||"unknown"}-location-${note.createdAt}`}>
                            {note.location?.town ? `${note.location.town}, ${note.location.state}` : "Unknown Location"}
                        </p>
                    </div>
                </section>
                {selectedNote?.id === note.id && (
                    <NoteExtendedDetails 
                        note={note} 
                        handleClose={handleClose}
                        handleIdentify={handleIdentify}
                        hasActiveDraft={!!drafts}
                    />
                )}
                </div>
            ))}
            {hasNextPage && validFetchMore && (
				<div className="pt-4 flex justify-center">
					<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
						{isFetchingNextPage ? <Spinner /> : <ExpandMoreIcon></ExpandMoreIcon>}
					</button>
				</div>
			)}
        </div>
    );
}
