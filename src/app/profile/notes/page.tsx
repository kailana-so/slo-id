"use client"; 
import React, {  useState } from "react";
import { useProfile } from "@/providers/ProfileProvider";
import { Note } from "@/types/note";
import Spinner from "@/components/common/Spinner";
import Image from 'next/image'
import { format } from 'date-fns';
import { NoteDetails } from "@/components/NoteDetails";
import { usePaginatedNotes } from "@/hooks/usePaginationCache";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useRouter } from "next/navigation";
import { updateSightingStatus } from "@/services/identificationService";
import { sentenceCase } from "@/utils/helpers";
import ImageModal from "@/components/common/ImageModal";
import { SightingStatus } from "@/lib/db/dbHelpers";
import dynamic from "next/dynamic";

const MapLocationSelector = dynamic(() => import("@/components/MapLocationSelector"), {
  ssr: false,
});
import GenericModal from "@/components/common/GenericModal";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { StatusIcon } from "@/components/common/StatusIcon"

export default function ViewNotes() {
    const { userData } = useProfile();
	// const router = useRouter();
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [modalImage, setModalImage] = useState<{ src: string; alt: string; imageId: string } | null>(null);
    const [modalLocationSelector, setModalLocationSelector] = useState<boolean>(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    

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


	const allNotes = data?.pages.flatMap(page => page.notes) ?? [];
    const totalCount = data?.pages[0]?.count ?? 0;
    const hasActiveDraft = data?.pages[0]?.drafts != 0;
    const allThumbnails = Object.assign({}, ...(data?.pages.map(p => p.thumbnails) ?? []));

    const validFetchMore = allNotes.length < totalCount;
    
    const handleClose = () => {
		setSelectedNote(null)
	}

    const handleIdentify = async (noteId: string) => {
        console.log("handleIdentify", noteId)
        // await updateSighting(noteId)
        // router.push(Routes.IDS);
    };

    const handleUpdateNote = async (noteId: string) => {
        console.log("handleUpdateNote", noteId)
    }

    const handleEditNote = async (noteId: string) => {
        console.log("handleEditNote", noteId)
        await updateSightingStatus(noteId, SightingStatus.DRAFT)
        // router.push(Routes.IDS);
    };

    return (
        <section>
            <div className="mb-4">
                <h4> Use tools to accurately identify your notes.</h4>
                <p> In keeping with the slow method, 1 active draft only.</p>
            </div>
            <div key='view-notes'>
                {allNotes.map((note) => (
                    <div key={note.id} className="card">
                    <section 
                        className="aligned content-center"
                        key={`${note.id}-${note.type}${note.createdAt}`}
                        onClick={() => setSelectedNote(note)}
                    >
                        {note.imageId && allThumbnails[note.imageId] ? (
                            <Image
                                src={allThumbnails[note.imageId]}
                                width={80}
                                height={80}
                                alt={`picture of ${note.name}`}
                                className="object-cover rounded-sm cursor-pointer hover:opacity-80"
                                style={{ width: "auto", height: "auto" }} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (note.imageId) {
                                        setModalImage({ 
                                            src: allThumbnails[note.imageId], 
                                            alt: `picture of ${note.name}`,
                                            imageId: note.imageId
                                        });
                                    }
                                }}
                            />
                        ) : (
                            <div className="image-placeholder">
                                No Image
                            </div>
                        )}
                        <div>
                            <div className=" flex justify-between">
                                <h4>{`${sentenceCase(note.type)}`}</h4>
                                <StatusIcon status={note.status} />
                            </div>
                            <p key={`${note.type||"unknown"}-${note.createdAt}`}>
                                {note.createdAt ? format(note.createdAt, "dd MMM yyyy HH:mm a") : "No Date"}
                            </p>
                            <p key={`${note.type||"unknown"}-location-${note.createdAt}`}>
                                {note.location?.town 
                                ? `${note.location.town}, ${note.location.state}` 
                                : (
                                    <button onClick={() => setModalLocationSelector(true)} className="ml-auto">
                                    <div>
                                        <AddLocationAltIcon></AddLocationAltIcon>
                                    </div>
                                </button>
                                )}
                            </p>
                        </div>
                    </section>
                    {selectedNote?.id === note.id && (
                        <NoteDetails 
                            note={note} 
                            handleClose={handleClose}
                            handleIdentify={handleIdentify}
                            handleEditNote={handleEditNote}
                            handleUpdateNote={handleUpdateNote}
                            isActiveDraft={note.status === SightingStatus.DRAFT}
                            hasActiveDraft={hasActiveDraft}
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
                <ImageModal
                    isOpen={!!modalImage}
                    onClose={() => setModalImage(null)}
                    imageSrc={modalImage?.src || ''}
                    alt={modalImage?.alt || ''}
                    {...(modalImage?.imageId && { imageId: modalImage.imageId })}
                    {...(userData?.userId && { userId: userData.userId })}
                />
                <GenericModal
                    isOpen={modalLocationSelector}
                    onClose={() => setModalLocationSelector(false)}
                >
                    <MapLocationSelector 
                        location={location}
                        setLocation={setLocation}
                    />
                </GenericModal>
            </div>
        </section>
    );
}
