"use client";

import { useState, useEffect } from 'react';
import NearbySpecies from "@/components/NearbySpecies";
import { getCurrentUserLocation } from "@/services/locationService";
import { getNearbySpecies } from "@/services/speciesService";
import { SpeciesOccurrence } from "@/types/species";

export default function NearbyPage() {
    const [species, setSpecies] = useState<SpeciesOccurrence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocationAndSpecies = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get user location
                const coords = await getCurrentUserLocation();
                
                // Fetch species data
                const speciesData = await getNearbySpecies(coords.latitude, coords.longitude, 2);
                setSpecies(speciesData);
            } catch (err) {
                console.error('Error getting location or species:', err);
                setError(err instanceof Error ? err.message : 'Failed to get your location or species data');
            } finally {
                setLoading(false);
            }
        };

        // Fetch location and species when user clicks "Nearby" menu item
        fetchLocationAndSpecies();
    }, []);

    return (
        <NearbySpecies 
            species={species}
            loading={loading}
            error={error}
            onRetry={() => window.location.reload()}
        />
    );
}