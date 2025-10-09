"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getCurrentUserGeolocation } from "@/services/locationService";
import SimpleSpeciesList from "@/components/SimpleSpeciesList";
import { SpeciesOccurrence } from "@/types/species";
import { getNearbySpecies } from "@/services/speciesService";
import type L from "leaflet";

const BaseMap = dynamic(() => import("../../components/BaseMap"), {
	ssr: false,
});

export default function MapsPage() {
	const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [species, setSpecies] = useState<SpeciesOccurrence[]>([]);
	const [speciesLoading, setSpeciesLoading] = useState(false);
	const [speciesError, setSpeciesError] = useState<string | null>(null);
	const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
	const [markersMap, setMarkersMap] = useState<Map<string, L.Marker>>(new Map());

	// 1. Fetch location on mount
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				setLoading(true);
				setError(null);
				const userLocation = await getCurrentUserGeolocation();
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

	// 2. Fetch species and add markers when location and mapInstance are available
	useEffect(() => {
		if (!location || !mapInstance) return;
		let cancelled = false;
		const fetchAndAddMarkers = async () => {
			setSpeciesLoading(true);
			setSpeciesError(null);
			try {
				const speciesData = await getNearbySpecies(location.latitude, location.longitude, 2);
				if (cancelled) return;
				setSpecies(speciesData);
				const L = await import("leaflet");
				const { default: Leaflet } = L;
				const speciesIcon = Leaflet.icon({
					iconUrl: "/imgs/species-pin.png",
					iconSize: [16, 16],
					iconAnchor: [16, 16],
				});
				const newMarkersMap = new Map<string, L.Marker>();
				speciesData.forEach((occ) => {
					if (occ.decimalLatitude && occ.decimalLongitude) {
						const marker = Leaflet.marker([occ.decimalLatitude, occ.decimalLongitude], { icon: speciesIcon })
							.addTo(mapInstance)
							.bindPopup(
								`<strong>${occ.vernacularName || occ.scientificName}</strong><br/>${occ.scientificName}`
							);
						// Store marker with occurrence UUID as key
						newMarkersMap.set(occ.uuid, marker);
					}
				});
				setMarkersMap(newMarkersMap);
			} catch (err) {
				if (cancelled) return;
				console.error('Error fetching nearby species:', err);
				setSpeciesError(err instanceof Error ? err.message : 'Failed to fetch species data');
			} finally {
				if (!cancelled) setSpeciesLoading(false);
			}
		};
		fetchAndAddMarkers();
		return () => { cancelled = true; };
	}, [location, mapInstance]);

	const handleMapReady = (map: L.Map) => {
		setMapInstance(map);
	};

	const handleSeeOnMap = (lat: number, lng: number, uuid: string) => {
		if (!mapInstance) return;
		// Pan to the location and zoom in
		mapInstance.setView([lat, lng], 15);
		// Open the specific marker's popup
		const marker = markersMap.get(uuid);
		if (marker) {
			marker.openPopup();
		}
		// Close drawer to show the map
		setDrawerOpen(false);
	};

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
					<BaseMap onMapReady={handleMapReady} initialLat={location.latitude} initialLng={location.longitude} />
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
								species={species}
								loading={speciesLoading}
								error={speciesError}
								onSeeOnMap={handleSeeOnMap}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
