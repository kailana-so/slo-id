"use client";
import { useProfile } from "@/providers/ProfileProvider";
import { getUserSightingsCoords } from "@/app/identification/identificationService";
import dynamic from "next/dynamic";
import { MapPin } from "@/types/user";
import L from "leaflet";
import { useCallback } from "react";
import { addNoteMarkers } from "@/utils/addNoteMarkers.client";

const BaseMap = dynamic(() => import("../../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const { userData } = useProfile();

	const handleMapReady = useCallback(async (map: L.Map) => {
		if (!userData) return;

		const { notes }: { notes: MapPin[] } = await getUserSightingsCoords(userData.userId);
		addNoteMarkers(map, notes);
	}, [userData]);

	return <BaseMap onMapReady={handleMapReady} />;
}
