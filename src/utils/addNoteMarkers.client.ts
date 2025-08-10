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

		L.marker([note.latitude, note.longitude], { icon })
			.addTo(map)
			.bindPopup(`
				${note.type}
				<br/>
				${note.name || "Unnamed"}
				<br/>
				${format(note.createdAt, "dd MMM yyyy")}`);

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
