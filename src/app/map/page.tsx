"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { getCurrentUserLocation } from "@/services/locationService";
import SimpleSpeciesList from "@/components/SimpleSpeciesList";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
  	ssr: false,
});

export default function MapsPage() {
	const [location, setLocation] = useState<{latitude: number; longitude: number; accuracy: number} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Get user location
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				setLoading(true);
				setError(null);
				
				const userLocation = await getCurrentUserLocation();
				setLocation(userLocation);
			} catch (err) {
				console.error('Error getting location:', err);
				setError(err instanceof Error ? err.message : 'Failed to get your location');
			} finally {
				setLoading(false);
			}
		};

		fetchLocation();
	}, []);

	const handleMapReady = useCallback(async (map: L.Map) => {
		console.log("[Map Ready]:", map);
	}, []);

	if (loading) {
		return (
			<div className="mt-4">
				<div className="card">
					<div className="flex items-center justify-center p-8">
						<div className="spinner"></div>
						<span className="ml-2">Getting your location...</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mt-4">
				<div className="card">
					<div className="p-4 text-center">
						<p className="text-red-500 mb-2">Error getting your location</p>
						<p className="text-sm text-gray-600">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!location) {
		return (
			<div className="mt-4">
				<div className="card">
					<div className="p-4 text-center">
						<p className="text-gray-500">Unable to determine your location</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-4">
			<div className="flex flex-row gap-6 h-[600px]">
				{/* Nearby Species - LEFT */}
				<div className="w-1/2 h-full overflow-y-auto">
					<SimpleSpeciesList 
						latitude={location.latitude} 
						longitude={location.longitude} 
						radius={2} 
					/>
				</div>
				
				{/* Map - RIGHT */}
				<div className="w-1/2 h-full">
					<BaseMap onMapReady={handleMapReady} />
				</div>
			</div>
		</div>
	);
}
