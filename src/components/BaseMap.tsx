"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getLocation } from "@/utils/getLocation";

interface BaseMapProps {
  onMapReady?: (map: L.Map) => void;
}

export default function BaseMap({ onMapReady }: BaseMapProps) {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {

		const init = async () => {
		
			let viewLat = -33.6688233;
			let viewLng = 150.323443;
			
			try {
				const { latitude, longitude } = await getLocation();
				viewLat = latitude;
				viewLng = longitude;
			} catch (err) {
				console.log("Using default location:", err);
			}

			if (!mapRef.current || mapRef.current.dataset.initialized) return;
			mapRef.current.dataset.initialized = "true";


			const map = L.map(mapRef.current).setView([viewLat, viewLng], 13);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: '&copy; OpenStreetMap contributors',
			}).addTo(map);

			onMapReady?.(map);
		};

		init();
	}, [onMapReady]);

	return <div ref={mapRef} className="card" style={{ height: "600px", width: "100%" }} />;
}
