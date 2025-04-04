"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NotePin } from "@/types/customTypes";
import { getNotesLocations } from "@/services/identificationService";
import { useProfile } from "@/providers/ProfileProvider";
import Spinner from "@/components/common/Spinner";

export default function UserMap() {
    console.log("UserMap mounted");

    const { userData } = useProfile();
    const [loading, setLoading] = useState(true);

    const mapRef = useRef<HTMLDivElement>(null);

    const arrowDownIcon = L.divIcon({
        html: `<div style="font-size: 16px; color:rgb(12, 6, 4); transform: rotate(90deg);">&#x27A4;</div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
      

    useEffect(() => {
        const loadMap = async () => {
        if (!userData || !mapRef.current || mapRef.current.dataset.initialized) return;
        mapRef.current.dataset.initialized = "true";
        try {
            const { notes } = (await getNotesLocations(userData.user_id)) || { notes: [] };

            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
              
                const map = L.map(mapRef.current!).setView([latitude, longitude], 13);
              
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                  attribution: "© OpenStreetMap contributors",
                }).addTo(map);
              
                notes.forEach((note: NotePin) => {
                  if (typeof note.latitude !== "number" || typeof note.longitude !== "number") return;
              
                  L.marker([note.latitude, note.longitude], { icon: arrowDownIcon })
                    .addTo(map)
                    .bindPopup(`${note.name || "Unnamed"}<br/>${new Date(note.createdAt).toLocaleString()}`)
                    .openPopup();
                });
              
                setLoading(false);
            });

        } catch (err) {
            console.error("Error loading map:", err);
        }
    };

        loadMap();
    }, [userData]);

    if (!userData) {
        console.warn("No user data found. Log in again");
        return null;
    }

    return (
        <div
            className="card"
            ref={mapRef}
            style={{ height: "600px", width: "100%", borderRadius: "8px" }}
        >
        </div>
    );
}
