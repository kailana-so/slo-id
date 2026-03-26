import { useState, useEffect } from 'react';
import UserSpeciesList from "@/components/UserSpeciesList";
import { getCurrentUserGeolocation } from "@/services/locationService";
import { getNearbySpecies } from "@/services/speciesService";
import { getNearbyUserSightings } from "@/services/identificationService";
import { SpeciesOccurrence } from "@/types/species";
import { MapPin } from "@/types/map";
import { useProfile } from "@/providers/ProfileProvider";

export default function NearbyPage() {
    const { userData } = useProfile();
    const [species, setSpecies] = useState<SpeciesOccurrence[]>([]);
    const [userNotes, setUserNotes] = useState<MapPin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocationAndSpecies = async () => {
            if (!userData) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Get user location
                const coords = await getCurrentUserGeolocation();
                
                // Fetch both ALA species data and user notes in parallel
                const [speciesData, nearbyNotesResult] = await Promise.all([
                    getNearbySpecies(coords.latitude, coords.longitude, 2),
                    getNearbyUserSightings(coords.latitude, coords.longitude, 2)
                ]);

                setSpecies(speciesData);
                setUserNotes(nearbyNotesResult.notes);
            } catch (err) {
                console.error('Error getting location or species:', err);
                setError(err instanceof Error ? err.message : 'Failed to get your location or species data');
            } finally {
                setLoading(false);
            }
        };

        // Fetch location and species when user clicks "Nearby" menu item
        fetchLocationAndSpecies();
    }, [userData]);

    return (
        <UserSpeciesList 
            species={species}
            userNotes={userNotes}
            loading={loading}
            error={error}
            onRetry={() => window.location.reload()}
        />
    );
}
