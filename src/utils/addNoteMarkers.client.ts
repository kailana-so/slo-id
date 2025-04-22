import { MapPin } from "@/types/user";
import { format } from "date-fns";

export const addNoteMarkers = async (map: L.Map, notes: MapPin[]) => {
	const { default: L } = await import("leaflet");

	const icon = L.icon({
		iconUrl: "/imgs/note-pin.png",
		iconSize: [32, 32],
		iconAnchor: [16, 32],
	});

	notes.forEach(note => {
		if (typeof note.latitude !== "number" || typeof note.longitude !== "number") return;

		L.marker([note.latitude, note.longitude], { icon })
			.addTo(map)
			.bindPopup(`${note.name || "Unnamed"}<br/>${format(note.createdAt, "dd MMM yyyy")}`);
	});
};
