"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDate } from '@/utils/helpers';
import { SpeciesOccurrence } from '@/types/species';
import { getNearbySpecies } from '@/services/speciesService';

interface SimpleSpeciesListProps {
  latitude: number;
  longitude: number;
  radius: number;
}

const SimpleSpeciesList: React.FC<SimpleSpeciesListProps> = ({ latitude, longitude, radius = 2 }) => {
  const [species, setSpecies] = useState<SpeciesOccurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
                <div>
                  <h4>{occurrence.vernacularName || occurrence.scientificName}</h4>
                  <p className="italic">{occurrence.scientificName}</p>
                  <p><span className="font-medium">Sighted:</span> {formatDate(occurrence.year, occurrence.month)}</p>
                </div>
              </section>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleSpeciesList; 