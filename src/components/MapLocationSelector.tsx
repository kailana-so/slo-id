"use client";
import { useCallback, useState, useEffect } from "react";
import type { Map, Marker, LeafletMouseEvent, Icon } from "leaflet";
import L from "leaflet";
import BaseMap from "@/components/BaseMap"; // adjust import path

interface MapLocationSelectorProps {
  location: { lat: number; lng: number } | null;
  setLocation: (location: { lat: number; lng: number } | null) => void;
}

export default function MapLocationSelector({ location, setLocation }: MapLocationSelectorProps) {
  const [icon, setIcon] = useState<Icon | null>(null);

  useEffect(() => {
    // Only create icon on client-side
    if (typeof window !== 'undefined') {
      setIcon(L.icon({
        iconUrl: "/imgs/note-pin.png",
        iconSize: [14, 14],
        iconAnchor: [14, 14],
      }));
    }
  }, []);

  const handleMapReady = useCallback((map: Map) => {
    let marker: Marker | null = null;

    map.on("click", (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });

      // remove previous marker
      if (marker) map.removeLayer(marker);

      // add new marker only if icon is available
      if (icon) {
        marker = L.marker([lat, lng], { icon })
          .addTo(map)
          .openPopup();
      }
    });
  }, [icon]);

  return (
    <div style={{ width: "100vw", margin: 2}} className="generic-modal-map">
      <BaseMap onMapReady={handleMapReady} />
      {location && (
        <div className="pl-4 mb-2">
          <p>
            <strong>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</strong> 
          </p>
        </div>
      )}
    </div>
  );
}
