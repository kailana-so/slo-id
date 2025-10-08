"use client";
import { useCallback, useState, useEffect } from "react";
import type { Map, Marker, LeafletMouseEvent, Icon } from "leaflet";
import L from "leaflet";
import BaseMap from "@/components/BaseMap"; // adjust import path

export default function MapLocationSelector() {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
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
      setSelected({ lat, lng });

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
      {selected && (
        <div className="pl-4 mb-2">
          <h4>
            <strong>{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</strong> 
          </h4>
        </div>
      )}
    </div>
  );
}
