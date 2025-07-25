"use client";
import { useProfile } from "@/providers/ProfileProvider";
import { getUserSightingsCoords } from "@/services/identificationService";
import dynamic from "next/dynamic";
import { MapPin } from "@/types/map";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { addNoteMarkers } from "@/utils/addNoteMarkers.client";

const BaseMap = dynamic(() => import("../../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const { userData } = useProfile();
	const [initialLat, setInitialLat] = useState<number | undefined>(undefined);
	const [initialLng, setInitialLng] = useState<number | undefined>(undefined);

	// Read URL parameters after component mounts to avoid hydration issues
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const lat = urlParams.get('lat');
			const lng = urlParams.get('lng');
			
			if (lat && lng) {
				const latitude = parseFloat(lat);
				const longitude = parseFloat(lng);
				if (!isNaN(latitude) && !isNaN(longitude)) {
					setInitialLat(latitude);
					setInitialLng(longitude);
					console.log(`Setting map to species location: ${latitude}, ${longitude}`);
				}
			}
		}
	}, []);

	const handleMapReady = useCallback(async (map: L.Map) => {
		if (!userData) return;

		// Add species location marker if coordinates are provided
		if (initialLat && initialLng) {
			const speciesIcon = L.icon({
				iconUrl: "/imgs/species-pin.png",
				iconSize: [16, 16],
				iconAnchor: [16, 16],
			});

			L.marker([initialLat, initialLng], { icon: speciesIcon })
				.addTo(map)
				.bindPopup("Species Location");
		}

		const { notes }: { notes: MapPin[] } = await getUserSightingsCoords(userData.userId);
		addNoteMarkers(map, notes);

	}, [userData, initialLat, initialLng]);

	return <BaseMap onMapReady={handleMapReady} initialLat={initialLat} initialLng={initialLng} />;
}
