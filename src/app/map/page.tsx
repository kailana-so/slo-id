"use client";

import { useEffect } from "react";
import { useProfile } from "@/providers/ProfileProvider";
import { getNotesLocations } from "@/services/identificationService";
import { getMapInstance } from "@/utils/mapInstance";
import { addMarkers } from "@/components/mapLayers/MarkersLayer";
import { BaseMap } from "@/components/mapLayers/BaseMap";

export default function MapsPage() {
	const { userData } = useProfile();

	useEffect(() => {
		if (!userData) return;

		getNotesLocations(userData.user_id).then(({ notes }) => {
			const map = getMapInstance();
			if (map) {
				addMarkers(map, notes);
			} else {
				console.warn("Map not ready");
			}
		});
	}, [userData]);

	return <BaseMap></BaseMap>;
}
