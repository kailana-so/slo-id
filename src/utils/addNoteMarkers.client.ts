import { MapPin } from "@/types/map";
import { format } from "date-fns";

export const addNoteMarkers = async (map: L.Map, notes: MapPin[]) => {
	const { default: L } = await import("leaflet");

	const icon = L.icon({
		iconUrl: "/imgs/note-pin.png",
		iconSize: [14, 14],
		iconAnchor: [14, 14],
	});

	notes.forEach(note => {
		if (typeof note.latitude !== "number" || typeof note.longitude !== "number") return;

		const popupContent = `
			<div>
				${note.thumbnailUrl ? `<img src="${note.thumbnailUrl}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
				<div><strong>${note.type}</strong></div>
				<div>${note.name || "Unnamed"}</div>
				<div style="font-size: 12px; color: #666;">${format(note.createdAt, "dd MMM yyyy")}</div>
			</div>
		`;

		L.marker([note.latitude, note.longitude], { icon })
			.addTo(map)
			.bindPopup(popupContent);

		// TODO: use actual cords
		const bboxes: L.LatLngBoundsExpression[] = [
					[[-33.71447, 150.32213], [-33.71424, 150.32222]],
					[[-33.71315, 150.35132], [-33.71293, 150.35151]],
				];
				  
		bboxes.forEach(bbox => {
			L.rectangle(bbox, {
				color: "var(--primary-brown)",
				weight: 1,
				fillOpacity: 0.1,
			}).addTo(map);
		});
				  
	});
};
