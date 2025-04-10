"use client";
import { useProfile } from "@/providers/ProfileProvider";
import { getUserNoteLocations } from "@/services/identificationService";
import dynamic from "next/dynamic";
import { NotePin } from "@/types/types";
import L from "leaflet";
import { useCallback } from "react";
import { addNoteMarkers } from "@/utils/addNoteMarkers";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const handleMapReady = useCallback(async (map: L.Map) => {
	}, []);

	return <BaseMap onMapReady={handleMapReady} />;
}
