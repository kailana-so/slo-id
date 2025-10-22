import { useState } from "react";
import Spinner from "@/components/common/Spinner";
import { usePaginatedIds } from "@/hooks/usePaginationCache";
import { useProfile } from "@/providers/ProfileProvider";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IdentificationDetails from "@/components/IdentificationDetails";
import { Note } from "@/types/note";

export default function IdentificationsPage() {
    const { userData } = useProfile();
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error
	} = usePaginatedIds(userData?.userId);

	if (!userData) return null;
	if (isLoading) return <Spinner />;
	if (error) return (
        <div key="error-getting-notes" className="card">
            <p>Error loading notes</p>
        </div>
    );

    const allNotes = data?.pages.flatMap(page => page.identifications) ?? [];
    const totalCount = data?.pages[0]?.count ?? 0;
    const allThumbnails = Object.assign({}, ...(data?.pages.map(p => p.thumbnails) ?? []));

    const validFetchMore = allNotes.length < totalCount

    return (
        <section>
            <div key='view-ids'>
                <div className="mb-4">
                    <h4>Your Identifications ({allNotes.length})</h4>
                    <p>Confirmed species identifications</p>
                </div>
                {allNotes.length > 0 
                ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allNotes.map((note) => (
                        selectedNote?.id === note.id ? (
                        <div key={note.id} className="card col-span-2 md:col-span-3 lg:col-span-4"
                        onClick={() => setSelectedNote(null)}>
                            <IdentificationDetails 
                                note={note} 
                                thumbnailUrl={note.imageId ? allThumbnails[note.imageId] : undefined}
                            />
                        </div>
                    ) : (
                    <div 
                        key={note.id} 
                        className="cursor-pointer card"
                        onClick={() => setSelectedNote(note)}
                    >
                        {note.imageId && allThumbnails[note.imageId] ? (
                            <img
                                src={allThumbnails[note.imageId]}
                                width={200}
                                height={200}
                                alt={`picture of ${note.name || note.scientificName}`}
                                className="object-cover rounded-sm w-full aspect-square" 
                            />
                        ) : (
                            <img
                                src={note.type === "insect" ? "/imgs/slo-id2.png" : "/imgs/slo-id1.png"}
                                width={200}
                                height={200}
                                alt="placeholder"
                                className="object-cover rounded-sm w-full aspect-square" 
                            />
                        )}
                        <div className="mt-2">
                            <h4>{note.scientificName || note.commonName || note.type}</h4>
                            {note.commonName && note.scientificName && (
                                <p>{note.commonName}</p>
                            )}
                        </div>
                    </div>
                    )))}
                    </div>
                ) : (
                <div className="mb-4">
                    <h4> You dont have any Identifications yet</h4>
                    <p>Start by taking a note and learning about the species to create a comprehensive identification</p>
                </div>
                )}
                {hasNextPage && validFetchMore && (
                    <div className="pt-4 flex justify-center">
                        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                            {isFetchingNextPage ? <Spinner /> : <ExpandMoreIcon></ExpandMoreIcon>}
                        </button>
                    </div>
                )}
                
            </div>
        </section>
    )
}
