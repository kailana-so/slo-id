"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { getLocation } from "@/utils/getLocation";
import "leaflet/dist/leaflet.css";
import { setMapInstance } from "@/utils/mapInstance";

export function BaseMap() {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const init = async () => {
			const { latitude, longitude } = await getLocation();
			if (!mapRef.current || mapRef.current.dataset.initialized) return;
			mapRef.current.dataset.initialized = "true";

			const map = L.map(mapRef.current).setView([latitude, longitude], 13);
			setMapInstance(map);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: '&copy; OpenStreetMap contributors',
			}).addTo(map);
		};

		init();
	}, []);

	return <div ref={mapRef} style={{ height: "600px", width: "100%" }} className="card" />;
}
