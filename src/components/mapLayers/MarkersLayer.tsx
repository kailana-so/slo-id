import L from "leaflet";
import { NotePin } from "@/types/types";
import { format } from "date-fns";

export function addMarkers(map: L.Map, notes: NotePin[]) {
  const noteIcon = L.icon({
    iconUrl: "/imgs/note-pin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  notes.forEach((note) => {
    if (typeof note.latitude !== "number" || typeof note.longitude !== "number") return;

    L.marker([note.latitude, note.longitude], { icon: noteIcon })
      .addTo(map)
      .bindPopup(`${note.name || "Unnamed"}<br/>${format(note.createdAt, "dd MMM yyyy")}`);
  });
}
