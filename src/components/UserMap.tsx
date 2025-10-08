"use client";
import { useProfile } from "@/providers/ProfileProvider";
import { getUserSightingsCoords } from "@/services/identificationService";
import { getImageURLs } from "@/services/imageService";
import { ImageType } from "@/hooks/usePaginationCache";
import dynamic from "next/dynamic";
import { MapPin } from "@/types/map";
import { useCallback, useEffect, useState } from "react";
import { addNoteMarkers } from "@/utils/addNoteMarkers.client";
import type { Map } from "leaflet";


const BaseMap = dynamic(() => import("./BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const { userData } = useProfile();
	const [initialLat, setInitialLat] = useState<number | undefined>(undefined);
	const [initialLng, setInitialLng] = useState<number | undefined>(undefined);
	const [speciesInfo, setSpeciesInfo] = useState<{ name: string; scientificName: string; image?: string } | null>(null);

	// Read URL parameters after component mounts to avoid hydration issues
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const lat = urlParams.get('lat');
			const lng = urlParams.get('lng');
			const name = urlParams.get('name');
			const scientificName = urlParams.get('scientificName');
			const image = urlParams.get('image');
			
			if (lat && lng) {
				const latitude = parseFloat(lat);
				const longitude = parseFloat(lng);
				if (!isNaN(latitude) && !isNaN(longitude)) {
					setInitialLat(latitude);
					setInitialLng(longitude);
				if (name) {
					setSpeciesInfo({ 
						name: name,
						scientificName: scientificName || 'Unknown',
						...(image && { image })
					});
				}
					console.log(`Setting map to species location: ${latitude}, ${longitude}`);
				}
			}
		}
	}, []);

	const handleMapReady = useCallback(async (map: Map) => {
		if (!userData) return;

		// Dynamically import Leaflet to avoid SSR issues
		const L = await import("leaflet");
		const { default: Leaflet } = L;

		// Add species location marker if coordinates are provided
		if (initialLat && initialLng) {
			const speciesIcon = Leaflet.icon({
				iconUrl: "/imgs/species-pin.png",
				iconSize: [16, 16],
				iconAnchor: [16, 16],
			});

		const speciesPopupContent = `
			<div>
				${speciesInfo?.image ? `<img src="${speciesInfo.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
				<div><strong>${speciesInfo?.name || 'Species Location'}</strong></div>
				${speciesInfo?.scientificName ? `<div style="font-size: 12px; font-style: italic; color: #666;">${speciesInfo.scientificName}</div>` : ''}
				<div style="font-size: 12px; color: #666;">${initialLat.toFixed(5)}, ${initialLng.toFixed(5)}</div>
			</div>
		`;
		
		Leaflet.marker([initialLat, initialLng], { icon: speciesIcon })
			.addTo(map)
			.bindPopup(speciesPopupContent);
		}

		const { notes }: { notes: MapPin[] } = await getUserSightingsCoords(userData.userId);
		
		// Fetch thumbnail URLs for notes with images
		const imageIds = notes.map(n => n.imageId).filter((id): id is string => !!id);
		const imageUrls = await getImageURLs(userData.userId, imageIds, ImageType.THUMBNAIL);
		const thumbnails = Object.fromEntries(
			imageUrls.map(({ filename, url }: { filename: string; url: string }) => [filename, url])
		);
		
		// Add thumbnail URLs to notes
		const notesWithThumbnails = notes.map(note => ({
			...note,
			thumbnailUrl: note.imageId ? thumbnails[note.imageId] : undefined
		}));
		
		addNoteMarkers(map, notesWithThumbnails);

	}, [userData, initialLat, initialLng, speciesInfo]);

	return <BaseMap 
		onMapReady={handleMapReady} 
		{...(initialLat !== undefined && { initialLat })}
		{...(initialLng !== undefined && { initialLng })}
	/>;
} 