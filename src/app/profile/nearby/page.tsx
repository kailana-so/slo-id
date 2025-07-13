"use client";

import { useState, useEffect } from 'react';
import NearbySpecies from "@/components/NearbySpecies";
import { getCurrentUserLocation } from "@/services/locationService";

export default function NearbyPage() {
    const [location, setLocation] = useState<{latitude: number; longitude: number; accuracy: number} | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocation = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const coords = await getCurrentUserLocation();
            setLocation(coords);
        } catch (err) {
            console.error('Error getting location:', err);
            setError(err instanceof Error ? err.message : 'Failed to get your location');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <h4>Nearby Species</h4>
                <div className="flex items-center justify-center p-8">
                    <div className="spinner"></div>
                    <span className="ml-2">Getting your location...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <h4>Nearby Species</h4>
                <div className="p-4 text-center">
                    <p className="text-red-500 mb-2">Error getting your location</p>
                    <p className="text-sm text-gray-600">{error}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Please check your browser location permissions and try again.
                    </p>
                    <button 
                        onClick={fetchLocation}
                        className="submit mt-2"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="card">
                <h4>Nearby Species</h4>
                <div className="p-4 text-center">
                    <p className="text-gray-500">Unable to determine your location</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NearbySpecies 
                latitude={location.latitude} 
                longitude={location.longitude} 
                radius={2} 
            />
        </div>
    );
}