"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { useCallback } from "react";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const handleMapReady = useCallback(async (map: L.Map) => {
		console.log("[Map Ready]:", map);
	}, []);

	return (
		<div className="mt-4">
			<BaseMap onMapReady={handleMapReady} />
		</div>
	);
}
