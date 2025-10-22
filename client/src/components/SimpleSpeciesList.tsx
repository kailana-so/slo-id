"use client";

import React from 'react';
import { formatDate } from '@/utils/helpers';
import { SpeciesOccurrence } from '@/types/species';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Spinner from './common/Spinner';

interface SimpleSpeciesListProps {
  latitude: number;
  longitude: number;
  radius: number;
  species: SpeciesOccurrence[];
  loading: boolean;
  error: string | null;
  onSeeOnMap?: (lat: number, lng: number, uuid: string) => void;
}

const SimpleSpeciesList: React.FC<SimpleSpeciesListProps> = ({species, loading, error, onSeeOnMap }) => {

  if (loading) {
    return (
      <div className="card">
        <h4>Nearby Species</h4>
        <div className="flex items-center justify-center p-8">
          <Spinner />
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
          <p className="text-sm text-gray-600">{error}</p>
          <button onClick={() => window.location.reload()}><h4>Try Again</h4></button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4>Nearby Species ({species.length})</h4>
        <p>Species in the map area</p>
      </div>
      
      {species.length === 0 ? (
        <div className="card">
          <div className="text-center p-8">
            <p className="text-gray-500">No species found in this area</p>
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
                  {onSeeOnMap && occurrence.decimalLatitude && occurrence.decimalLongitude && (
                      <button 
                        onClick={() => onSeeOnMap(occurrence.decimalLatitude, occurrence.decimalLongitude, occurrence.uuid)}
                        className="flex items-end gap-2"
                      >
                        <h4>See on map</h4> 
                        <NavigateNextIcon />
                      </button>
                  )}
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