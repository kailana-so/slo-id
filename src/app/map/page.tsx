"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getCurrentUserLocation } from "@/services/locationService";
import SimpleSpeciesList from "@/components/SimpleSpeciesList";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
	ssr: false,
});

export default function MapsPage() {
	const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);


	useEffect(() => {
		const fetchLocation = async () => {
			try {
				setLoading(true);
				setError(null);

				const userLocation = await getCurrentUserLocation();
				setLocation(userLocation);
			} catch (err) {
				console.error("Error getting location:", err);
				setError(err instanceof Error ? err.message : "Failed to get your location");
			} finally {
				setLoading(false);
			}
		};

		fetchLocation();
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
						<p className="text-sm text-gray-600">Unable to determine your location</p>
						<p className="text-sm text-gray-500 mt-2">
							You can view species in Upper Moutains, Australia as a fallback.
						</p>
						<button 
							onClick={() => setLocation({ latitude: -33.6688233, longitude: 150.323443, accuracy: 0 })}
						>
							<h4>View Upper Moutains species</h4>
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="maps-wrapper">
			<div className="maps-container">

				{/* BaseMap background */}
				<div className="maps-basemap">
					<BaseMap />
				</div>

				{/* Drawer */}
				<div className={`maps-drawer ${drawerOpen ? "open" : "closed"}`}>
					<div className="drawer-content-wrapper">
						<button className="drawer-tab-toggle" onClick={() => setDrawerOpen(prev => !prev)}>
							<h3>Nearby</h3>
							{drawerOpen ? "←" : "→"}
						</button>

						<div className="drawer-content">
							<SimpleSpeciesList
								latitude={location.latitude}
								longitude={location.longitude}
								radius={2}
							/>
						</div>
					</div>
				</div>

			</div>
		</div>

	);
}
