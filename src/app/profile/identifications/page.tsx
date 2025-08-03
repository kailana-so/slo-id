"use client"

import Spinner from "@/components/common/Spinner";
import { usePaginatedIds } from "@/hooks/usePaginationCache";
import { useProfile } from "@/providers/ProfileProvider";
import { sentenceCase } from "@/utils/helpers";
import { format } from "date-fns";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import { SightingStatus } from "@/lib/db/dbHelpers";
import DrawIcon from '@mui/icons-material/Draw';

export default function Identify() {
    const { userData } = useProfile();

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
    const fullImages = Object.assign({}, ...(data?.pages.map(p => p.fullImages) ?? []));

    const validFetchMore = allNotes.length < totalCount
    const renderIsDraft = (status: string) => {
        if (status == SightingStatus.DRAFT) return <DrawIcon></DrawIcon>
    }

    return (
        <section>
            <div className="mb-4">
                <h4> Use tools to accurately identify your notes.</h4>
                <p> In keeping with the slow method, 1 active drafts limit.</p>
            </div>
            <div key='view-ids'>
            {allNotes.map((note) => (
                <div key={note.id} className="card">
                <section 
                    className="aligned content-center"
                    key={`${note.id}-${note.type}${note.createdAt}-${note.status}`}
                >
                    {note.imageId && fullImages[note.imageId] && (
                        <Image
                            src={fullImages[note.imageId]}
                            width={100}
                            height={100}
                            alt={`picture of ${note.name}`}
                            className="object-cover rounded-sm" 
                        />
                    )}
                    <div>
                        {renderIsDraft(String(note.status))}
                        <h4>{`${sentenceCase(note.type)}`}</h4>
                        <p key={`${note.type||"unknown"}-${note.createdAt}`}>
                            {note.createdAt ? format(note.createdAt, "dd MMM yyyy HH:mm a") : "No Date"}
                        </p>
                    </div>
                </section>
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
        </section>
    )
}

//  identity payload needs a key isConfirmedID bool
//  when a user passes a note from "notes" to "identify" 
//  the note will be stored in memory, until the user makes an update and saves
//  on save the note will be stoore in "identifications" as a draft 
//  isConfirmedID = false

//  pins will be split ebtween notes, IDs and drafts


// tools
// based on "type" if would be ideal to query
// "bird", "insect", "reptile", "plant" API for scientific names
//  user must search via a common name mathc for a scientific name
