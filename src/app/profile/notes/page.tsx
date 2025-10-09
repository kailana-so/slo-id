"use client"; 
import React, {  useState } from "react";
import { useProfile } from "@/providers/ProfileProvider";
import { Note } from "@/types/note";
import Spinner from "@/components/common/Spinner";
import Image from 'next/image'
import { format } from 'date-fns';
import { NoteDetails } from "@/components/NoteDetails";
import { usePaginatedNotes } from "@/hooks/usePaginationCache";
import { useQueryClient } from "@tanstack/react-query";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useRouter } from "next/navigation";
import { updateSightingStatus, updateSightingLocation, updateSightingFields } from "@/services/identificationService";
import { sentenceCase } from "@/utils/helpers";
import ImageModal from "@/components/common/ImageModal";
import { SightingStatus } from "@/lib/db/dbHelpers";
import dynamic from "next/dynamic";
import GenericModal from "@/components/common/GenericModal";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Snackbar from "@/components/common/Snackbar";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DrawIcon from '@mui/icons-material/Draw';

const MapLocationSelector = dynamic(() => import("@/components/MapLocationSelector"), {
  ssr: false,
});

export default function ViewNotes() {
    const { userData } = useProfile();
	const queryClient = useQueryClient();
	// const router = useRouter();
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [modalImage, setModalImage] = useState<{ src: string; alt: string; imageId: string } | null>(null);
    const [modalLocationSelector, setModalLocationSelector] = useState<boolean>(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [snackbar, setSnackbar] = useState({ isOpen: false, message: "", type: "success" as "success" | "error" });

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

    const handleUpdateNote = async (noteId: string, updates: Record<string, string | boolean>, isComplete: boolean) => {
        try {
            // Update fields and status if complete
            const allUpdates = {
                ...updates,
                ...(isComplete && { status: SightingStatus.IDENTIFICATION })
            };
            await updateSightingFields(noteId, allUpdates);
            // Refresh the data
            await queryClient.invalidateQueries({ queryKey: ["paginatedNotes", userData?.userId] });
            setSnackbar({ 
                isOpen: true, 
                message: isComplete ? "Identification confirmed" : "Note updated successfully", 
                type: "success" 
            });
            if (isComplete) {
                setSelectedNote(null);
            }
        } catch (error) {
            console.error("Failed to update note", error);
            setSnackbar({ isOpen: true, message: "Failed to update note", type: "error" });
        }
    }

    const handleEditNote = async (noteId: string) => {
        try {
            // Show immediate feedback
            setSnackbar({ isOpen: true, message: "Converting to draft...", type: "success" });
            
            await updateSightingStatus(noteId, SightingStatus.DRAFT);
            
            // Refresh the data
            await queryClient.invalidateQueries({ queryKey: ["paginatedNotes", userData?.userId] });
            
            setSnackbar({ isOpen: true, message: "Converted to draft", type: "success" });
        } catch (error) {
            console.error("Failed to convert to draft", error);
            setSnackbar({ isOpen: true, message: "Failed to convert to draft", type: "error" });
        }
    };

    const handleLocationUpdate = (note: Note) => {
        setModalLocationSelector(true);
        setSelectedNote(note);
    }

    const handleSaveLocation = async () => {
        console.log("handleSaveLocation called", { location, selectedNote });
        if (!location || !selectedNote) {
            console.log("Missing location or selectedNote");
            return;
        }
        console.log("Proceeding with save")
        try {
            await updateSightingLocation(selectedNote.id, location.lat, location.lng);
            // Refresh the data first
            await queryClient.invalidateQueries({ queryKey: ["paginatedNotes", userData?.userId] });
            setSnackbar({ isOpen: true, message: "Location updated successfully", type: "success" });
            setModalLocationSelector(false);
            setLocation(null);
        } catch (error) {
            console.error("Failed to update location", error);
            setSnackbar({ isOpen: true, message: "Failed to update location", type: "error" });
        }
    };

    return (
        <section>
            <div className="mb-4">
                <h4> Your notes ({allNotes.length})</h4>
                <p> In keeping with the slow method, 1 active draft only.</p>
            </div>
            <div key='view-notes'>
                {allNotes.map((note) => (
                    <div key={note.id} className={`card`}>
                    <section 
                        className="aligned content-center"
                        key={`${note.id}-${note.type}${note.createdAt}`}
                    >
                        {note.imageId && allThumbnails[note.imageId] ? (
                            <Image
                                src={allThumbnails[note.imageId]}
                                width={60}
                                height={60}
                                alt={`picture of ${note.name}`}
                                className="object-cover rounded-sm cursor-pointer"
                                // style={{ width: "auto", height: "auto" }} 
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
                            <Image
                                src={note.type === "insect" ? "/imgs/slo-id2.png" : "/imgs/slo-id1.png"}
                                width={60}
                                height={60}
                                alt="placeholder"
                                className="object-cover rounded-sm"
                            />
                        )}
                        <div style={{ width: "100%" }}>
                            <div className="flex justify-between" style={{ width: "100%" }}>
                                <div className="flex items-center gap-2">   
                                    {note.status === SightingStatus.DRAFT ? (
                                        <div className='badge-item unselected flex items-center gap-2'>
                                            <DrawIcon fontSize="small" />
                                            <h4>{`${sentenceCase(note.type)}`}</h4>
                                        </div>
                                    ) : (
                                        <h4>{`${sentenceCase(note.type)}`}</h4>
                                    )}
                                </div>
                                <span 
                                    onClick={() => {
                                        setSelectedNote(selectedNote?.id === note.id ? null : note);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {selectedNote?.id === note.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </span>
                            </div>
                            <p key={`${note.type||"unknown"}-${note.createdAt}`}>
                                {note.createdAt ? format(note.createdAt, "dd MMM yyyy hh:mm a") : "No Date"}
                            </p>
                            <p key={`${note.type||"unknown"}-location-${note.createdAt}`}>
                                {note.location?.town || note.location?.municipality
                                ? `${note.location.town || note.location.municipality}, ${note.location.state}` 
                                : (
                                    <button onClick={() => handleLocationUpdate(note)} className="ml-auto">
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
                    onClose={() => {
                        setModalLocationSelector(false);
                        setLocation(null);
                    }}
                >
                    <div className="generic-modal-map">
                        <MapLocationSelector 
                            location={location}
                            setLocation={setLocation}
                        />
                        {location && (
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSaveLocation}
                                    className="btn-primary mb-4 mr-2"
                                >
                                    <h4>Save</h4>
                                </button>
                                
                            </div>
                        )}
                    </div>
                </GenericModal>
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
                />
            </div>
        </section>
    );
}
