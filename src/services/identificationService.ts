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

const PAGE_SIZE = 3;

const addSighting = async (
    sighting: FormData
) => {

    sighting[DocumentTimestamp.CREATED_AT] = Date.now();
    sighting[SightingFields.Status] = SightingStatus.SIGHTING
    console.log(`[addSighting] Adding sighting to DB with payload`, sighting)

    try {
        const docRef = await addDoc(sightingsCollection(), sighting);
        console.log(`[addSighting] Sighting added with id: ${docRef.id} for user: ${sighting.userId}`)
    } catch (error) {
        console.error("Error adding user sighting: ", error);
    }
};

const updateSighting = async (
    noteId: string
) => {

    const updates = {
        [DocumentTimestamp.UPDATED_AT]: Date.now(),
        [SightingFields.Status]: SightingStatus.DRAFT
    }
    console.log(`[updateSighting] Updating sighting ${noteId} updates`, updates)
    try {
        const docRef = await updateDoc(sightingsDoc(noteId), updates);
        console.log(docRef, "docRef")
    } catch (error) {
        console.error("[updateSighting] Error updating sighting: ", error);
    }
};

const getSightings = async (
	userId: string,
    lastDoc?: QueryDocumentSnapshot
): Promise<GetNotesResult> => {
    console.log("[getSightings] Fetching sightings")
    
    const sightingType = SightingStatus.SIGHTING

    try {

        const baseConstraints: QueryConstraint[] = [
            where(SightingFields.UserId, "==", userId),
            where(SightingFields.Status, "==", sightingType),
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
            getStatusCount(userId, sightingType)
        ]);

        // like marshal in go - casting
        const notes: Note[] = documentSnapshots.docs
            .map(doc => ({
                id: doc.id,
                ...(doc.data() as { type: string } & Record<string, unknown>),
            }))          
            .filter((note): note is Note => note.type != null);

        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        console.log("Total drafts:", draftSnapshot.count);

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

    console.log("[getIdentifications] Fetching Ids")

    const idTypes = [SightingStatus.DRAFT, SightingStatus.IDENTIFICATION]
    
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
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        console.log("Total count:", countSnapshot.count);

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


    console.log("[getDraftCount] Fetching draft count")
    
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

        console.log("Total count:", countSnapshot.data().count);

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
    updateSighting,
    getIdentifications,
    getStatusCount
};
