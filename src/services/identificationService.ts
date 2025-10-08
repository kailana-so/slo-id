import { MapPin } from "@/types/map";
import { Note } from "@/types/note";
import { 
    addDoc, getDocs, updateDoc, 
    orderBy, query, limit, startAfter, where,
    QueryDocumentSnapshot, DocumentData, 
    QueryConstraint, getCountFromServer } from "firebase/firestore";
import { 
    sightingsCollection, 
    SightingFields, 
    DocumentTimestamp, 
    SightingStatus, 
    sightingsDoc } from "@/lib/db/dbHelpers";
import { FormData } from "@/types/note";

type GetNotesResult = {
    notes: Note[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    count: number;
    drafts: number;
};

type GetIdentificationsResult = {
    identifications: Note[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    count: number;
};

type GetMapPinsResult = {
    notes: MapPin[];
};

const PAGE_SIZE = 10;

const addSighting = async (
    sighting: FormData
) => {

    sighting[DocumentTimestamp.CREATED_AT] = Date.now();
    sighting[SightingFields.Status] = SightingStatus.SIGHTING

    try {
        await addDoc(sightingsCollection(), sighting);
    } catch (error) {
        console.error("Error adding user sighting: ", error);
    }
};

const updateSightingStatus = async (
    noteId: string,
    status: string
) => {

    const updates = {
        [DocumentTimestamp.UPDATED_AT]: Date.now(),
        [SightingFields.Status]: status
    }
    try {
        await updateDoc(sightingsDoc(noteId), updates);
    } catch (error) {
        console.error("[updateSighting] Error updating sighting: ", error);
    }
};

const getSightings = async (
	userId: string,
    lastDoc?: QueryDocumentSnapshot
): Promise<GetNotesResult> => {
    
    const sightingType = [SightingStatus.SIGHTING, SightingStatus.DRAFT]

    try {
        const baseConstraints: QueryConstraint[] = [
            where(SightingFields.UserId, "==", userId),
            where(SightingFields.Status, "in", sightingType),
            orderBy(SightingFields.CreatedAt, "desc"),
        ];
        
        const queryConstraints: QueryConstraint[] = [...baseConstraints];

        if (lastDoc) {
            queryConstraints.push(startAfter(lastDoc.get(SightingFields.CreatedAt)));
        }
        queryConstraints.push(limit(PAGE_SIZE));
                
        const dbQuery = query(sightingsCollection(), ...queryConstraints);
        const countQuery = query(sightingsCollection(), ...baseConstraints)

        const [documentSnapshots, countSnapshot, draftSnapshot] = await Promise.all([
            getDocs(dbQuery),
            getCountFromServer(countQuery),
            getStatusCount(userId, SightingStatus.DRAFT)
        ]);

        // like marshal in go - casting
        const notes: Note[] = documentSnapshots.docs
            .map(doc => ({
                id: doc.id,
                ...(doc.data() as { type: string } & Record<string, unknown>),
            }))          
            .filter((note): note is Note => note.type != null);

        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1] || null;

        return { 
            notes, 
            lastDoc: lastVisible, 
            count: countSnapshot.data().count, 
            drafts: draftSnapshot.count 
        };
    } catch (error) {
        console.error("[getSightings] Error getting sighting:", error);
        return { 
            notes: [], 
            lastDoc: null, 
            count: 0, 
            drafts: 0 
        };
    }
};

const getUserSightingsCoords = async (
  userId: string
): Promise<GetMapPinsResult> => {
	try {
		const q = query(
			sightingsCollection(),
			where("userId", "==", userId)
		);

		const snapshot = await getDocs(q);

		const notes: MapPin[] = snapshot.docs
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
                type: data.type
				};
			})
			.filter(Boolean) as MapPin[];

		return { notes };
	} catch (error) {
		console.error("Error fetching sightings with location:", error);
		return { notes: [] };
	}
};


const getIdentifications = async (
	userId: string,
    lastDoc?: QueryDocumentSnapshot
): Promise<GetIdentificationsResult> => {

    const idTypes = [SightingStatus.IDENTIFICATION]
    
    try {
        const baseConstraints: QueryConstraint[] = [
            where(SightingFields.UserId, "==", userId),
            where(SightingFields.Status, "in", idTypes),
            orderBy(SightingFields.CreatedAt, "desc"),
        ];
        
        const queryConstraints: QueryConstraint[] = [...baseConstraints];
        if (lastDoc) {
            queryConstraints.push(startAfter(lastDoc.get(SightingFields.CreatedAt)));
        }
        queryConstraints.push(limit(PAGE_SIZE));
                
        const dbQuery = query(sightingsCollection(), ...queryConstraints);

        const [documentSnapshots, countSnapshot] = await Promise.all([
            getDocs(dbQuery),
            getStatusCount(userId, idTypes)
        ]);

        // like marshal in go - casting
        const identifications: Note[] = documentSnapshots.docs
            .map(doc => ({
                id: doc.id,
                ...(doc.data() as { type: string } & Record<string, unknown>),
            }))          
            .filter((note): note is Note => note.type != null);

        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1] || null;

        return { 
            identifications, 
            lastDoc: lastVisible, 
            count: countSnapshot.count, 
        };
    } catch (error) {
        console.error("[getIdentifications] Error getting Ids:", error);
        return { 
            identifications: [], 
            lastDoc: null, 
            count: 0, 
        };
    }
};

const getStatusCount = async (
	userId: string,
    statusTypes: string | string[],
): Promise<{ count: number }> => {
    
    try {
        const baseConstraints: QueryConstraint[] = [
            where(SightingFields.UserId, "==", userId),
            Array.isArray(statusTypes)
            ? where(SightingFields.Status, "in", statusTypes)
            : where(SightingFields.Status, "==", statusTypes),
        ];
                        
        const countQuery = query(sightingsCollection(), ...baseConstraints)

        const [countSnapshot] = await Promise.all([
            getCountFromServer(countQuery),
        ]);
        return { 
            count: countSnapshot.data().count, 
        };
    } catch (error) {
        console.error("[getDraftCount] Error getting DraftCount:", error);
        return { 
            count: 0, 
        };
    }
};
   

export {
    addSighting,
    getSightings,
    getUserSightingsCoords,
    updateSightingStatus,
    getIdentifications,
    getStatusCount
};
