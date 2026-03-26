import { useState, useEffect, useMemo } from "react";
import { useProfile } from "@/providers/ProfileProvider";
import { Note, NoteFormType, SightingStatus, MediaType } from "@/types/note";
import Spinner from "@/components/common/Spinner";
import { format } from 'date-fns';
import { NoteDetails } from "@/components/NoteDetails";
import { usePaginatedNotes } from "@/hooks/usePaginationCache";
import { useQueryClient } from "@tanstack/react-query";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import { Routes } from "@/enums/routes";
import { updateSightingStatus, updateSightingLocation, updateSightingFields } from "@/services/identificationService";
import { sentenceCase } from "@/utils/helpers";
import GenericModal from "@/components/common/GenericModal";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Snackbar from "@/components/common/Snackbar";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DrawIcon from '@mui/icons-material/Draw';
import MapLocationSelector from "@/components/MapLocationSelector";
import { getSignedUrlsByKey } from "@/services/imageService";

export default function NotesPage() {
    const { userData } = useProfile();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [modalLocationSelector, setModalLocationSelector] = useState<boolean>(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [snackbar, setSnackbar] = useState({ isOpen: false, message: "", type: "success" as "success" | "error" });
    const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = usePaginatedNotes(userData?.id);

    const allNotes = data?.pages.flatMap(page => page.notes) ?? [];

    const thumbnailKeys = useMemo(() => {
        const keys = allNotes.flatMap(n => n.media.map(m => m.thumbnail_key).filter(Boolean) as string[]);
        return [...new Set(keys)];
    }, [allNotes]);

    useEffect(() => {
        if (thumbnailKeys.length === 0) return;
        getSignedUrlsByKey(thumbnailKeys).then(setThumbnailUrls).catch(console.error);
    }, [thumbnailKeys.join(",")]);

    if (!userData) return null;
    if (isLoading) return <Spinner />;
    if (error) return (
        <div key="error-getting-notes" className="card">
            <p>Error loading notes</p>
        </div>
    );

    const totalCount = data?.pages[0]?.count ?? 0;
    const hasActiveDraft = (data?.pages[0]?.drafts ?? 0) !== 0;
    const validFetchMore = allNotes.length < totalCount;

    const handleUpdateNote = async (noteId: string, updates: Record<string, string | boolean>, isComplete: boolean) => {
        try {
            const allUpdates = {
                ...updates,
                ...(isComplete && { status: SightingStatus.IDENTIFICATION })
            };
            await updateSightingFields(noteId, allUpdates);
            await queryClient.invalidateQueries({ queryKey: ["paginatedNotes", userData?.id] });
            setSnackbar({
                isOpen: true,
                message: isComplete ? "Identification confirmed" : "Note updated successfully",
                type: "success"
            });
            if (isComplete) {
                setSelectedNote(null);
                navigate(Routes.IDS);
            }
        } catch (error) {
            console.error("Failed to update note", error);
            setSnackbar({ isOpen: true, message: "Failed to update note", type: "error" });
        }
    };

    const handleEditNote = async (noteId: string) => {
        try {
            setSnackbar({ isOpen: true, message: "Converting to draft...", type: "success" });
            await updateSightingStatus(noteId, SightingStatus.DRAFT);
            await queryClient.invalidateQueries({ queryKey: ["paginatedNotes", userData?.id] });
            setSnackbar({ isOpen: true, message: "Converted to draft", type: "success" });
        } catch (error) {
            console.error("Failed to convert to draft", error);
            setSnackbar({ isOpen: true, message: "Failed to convert to draft", type: "error" });
        }
    };

    const handleLocationUpdate = (note: Note) => {
        setModalLocationSelector(true);
        setSelectedNote(note);
    };

    const handleSaveLocation = async () => {
        if (!location || !selectedNote) return;
        try {
            await updateSightingLocation(selectedNote.id, location.lat, location.lng);
            await queryClient.invalidateQueries({ queryKey: ["paginatedNotes", userData?.id] });
            setSnackbar({ isOpen: true, message: "Location updated successfully", type: "success" });
            setModalLocationSelector(false);
            setLocation(null);
        } catch (error) {
            console.error("Failed to update location", error);
            setSnackbar({ isOpen: true, message: "Failed to update location", type: "error" });
        }
    };

    const firstPhoto = (note: Note) => note.media.find(m => m.media_type === MediaType.PHOTO);

    return (
        <section>
            <div className="mb-4">
                <h4>Your notes ({allNotes.length})</h4>
                <p>In keeping with the slow method, 1 active draft only.</p>
            </div>
            <div key='view-notes'>
                {allNotes.map((note) => (
                    <div key={note.id} className="card">
                        <section
                            className="aligned content-center"
                            key={`${note.id}-${note.type}${note.created_at}`}
                        >
                            <img
                                src={(() => {
                                    const photo = firstPhoto(note);
                                    if (photo?.thumbnail_key && thumbnailUrls[photo.thumbnail_key]) {
                                        return thumbnailUrls[photo.thumbnail_key];
                                    }
                                    return note.type === NoteFormType.INSECT ? "/imgs/slo-id2.png" : "/imgs/slo-id1.png";
                                })()}
                                width={60}
                                height={60}
                                alt={firstPhoto(note) ? `picture of ${note.name ?? note.type}` : "placeholder"}
                                className="object-cover rounded-sm"
                            />
                            <div style={{ width: "100%" }}>
                                <div className="flex justify-between" style={{ width: "100%" }}>
                                    <div className="flex items-center gap-2">
                                        {note.status === SightingStatus.DRAFT ? (
                                            <div className='badge-item unselected flex items-center gap-2'>
                                                <DrawIcon fontSize="small" />
                                                <h4>{sentenceCase(note.type ?? "")}</h4>
                                            </div>
                                        ) : (
                                            <h4>{sentenceCase(note.type ?? "")}</h4>
                                        )}
                                    </div>
                                    <span
                                        onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                                        className="cursor-pointer"
                                    >
                                        {selectedNote?.id === note.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </span>
                                </div>
                                <p key={`${note.type ?? "unknown"}-${note.created_at}`}>
                                    {note.created_at ? format(new Date(note.created_at), "dd MMM yyyy hh:mm a") : "No Date"}
                                </p>
                                <p key={`${note.type ?? "unknown"}-location-${note.created_at}`}>
                                    {note.location?.town || note.location?.municipality
                                        ? `${note.location.town || note.location.municipality}, ${note.location.state}`
                                        : (
                                            <button onClick={() => handleLocationUpdate(note)} className="ml-auto">
                                                <AddLocationAltIcon />
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
                            {isFetchingNextPage ? <Spinner /> : <ExpandMoreIcon />}
                        </button>
                    </div>
                )}
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
                                <button onClick={handleSaveLocation} className="btn-primary mb-4 mr-2">
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
