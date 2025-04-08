"use client";
import { useProfile } from "@/providers/ProfileProvider";
import { getNotesLocations } from "@/services/identificationService";
import dynamic from "next/dynamic";
import { NotePin } from "@/types/types";
import L from "leaflet";
import { useCallback } from "react";
import { addNoteMarkers } from "@/utils/addNoteMarkers";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const { userData } = useProfile();

	const handleMapReady = useCallback(async (map: L.Map) => {
		if (!userData) return;

		const { notes }: { notes: NotePin[] } = await getNotesLocations(userData.user_id);
		addNoteMarkers(map, notes);
	}, [userData]);

	return <BaseMap onMapReady={handleMapReady} />;
}
