"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/helpers';
import { SpeciesOccurrence } from '@/types/species';
import { getNearbySpecies } from '@/services/speciesService';
import { Routes } from '@/enums/routes';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface NearbySpeciesProps {
  latitude: number;
  longitude: number;
  radius: number;
}

const NearbySpecies: React.FC<NearbySpeciesProps> = ({ latitude, longitude, radius = 2 }) => {
  const [species, setSpecies] = useState<SpeciesOccurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNearbySpecies = async () => {
      if (!latitude || !longitude || !radius) return;

      setLoading(true);
      setError(null);

      try {
        const speciesData = await getNearbySpecies(latitude, longitude, radius);
        setSpecies(speciesData);
      } catch (err) {
        console.error('Error fetching nearby species:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch species data');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbySpecies();
  }, [latitude, longitude, radius]);

  const handleSeeOnMap = (lat: number, lng: number) => {
    // Navigate to the profile map page with coordinates as URL parameters
    router.push(`${Routes.USERMAP}?lat=${lat}&lng=${lng}`);
  };

  if (loading) {
    return (
      <div className="card">
        <h4>Nearby Species</h4>
        <div className="flex items-center justify-center p-8">
          <div className="spinner"></div>
          <span className="ml-2">Finding species near you...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h4>Nearby Species</h4>
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">Error loading species data</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="submit mt-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-4">
        <h4>Nearby Species ({species.length})</h4>
        <p>Within {radius}km of your location</p>
      </div>
      
      {species.length === 0 ? (
        <div className="card">
          <div className="text-center p-8">
            <p className="text-gray-500">No species found in this area</p>
            <p className="text-sm text-gray-400">Try increasing the search radius</p>
          </div>
        </div>
      ) : (
        <div>
          {species.map((occurrence) => (
            <div key={occurrence.uuid} className="card">
              <section className="aligned content-center">
                {occurrence.thumbnailUrl && (
                  <Image
                    src={occurrence.thumbnailUrl}
                    width={200}
                    height={100}
                    alt={occurrence.vernacularName || occurrence.scientificName}
                    className="object-cover rounded-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h4>{occurrence.vernacularName || occurrence.scientificName}</h4>
                  <p className="italic">{occurrence.scientificName}</p>
                  <br />
                  <p><span className="font-medium">Phylum:</span> {occurrence.phylum}</p>
                  <p><span className="font-medium">Class:</span> {occurrence.classs}</p>
                  {occurrence.species && <p><span className="font-medium">Species:</span> {occurrence.species}</p>}
                  <p><span className="font-medium">Sighted:</span> {formatDate(occurrence.year, occurrence.month)}</p>
                  <div className="content-center gap-4 flex flex-row pt-2">
                    <button 
                        onClick={() => handleSeeOnMap(occurrence.decimalLatitude, occurrence.decimalLongitude)}
                    >
                        <h4>See on map</h4> 
                    </button>
                    <NavigateNextIcon></NavigateNextIcon>
                  </div>
                </div>
              </section>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbySpecies; 