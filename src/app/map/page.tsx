"use client";

import { getUserSightingsCoords } from "@/app/identification/identificationService";
import dynamic from "next/dynamic";
import { MapPin } from "@/types/sighting";
import L from "leaflet";
import { useCallback } from "react";
import { addNoteMarkers } from "@/utils/addNoteMarkers.client";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const handleMapReady = useCallback(async (map: L.Map) => {
	}, []);

	return (
		<div className="mt-4">
			<BaseMap onMapReady={handleMapReady} />
		</div>
	);
}
