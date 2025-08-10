"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/helpers';
import { SpeciesOccurrence } from '@/types/species';
import { Routes } from '@/enums/routes';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ImageModal from './common/ImageModal';

interface NearbySpeciesProps {
  species: SpeciesOccurrence[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const NearbySpecies: React.FC<NearbySpeciesProps> = ({ species, loading, error, onRetry }) => {
  const router = useRouter();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; imageId?: string; userId?: string } | null>(null);



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
          <p className="text-sm text-gray-600">{error}</p>
          <button onClick={onRetry}><h4>Try Again</h4></button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4>Nearby Species ({species.length})</h4>
        <p>Within 2km of your location</p>
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
                    onClick={() => setModalImage({
                      src: occurrence.thumbnailUrl!,
                      alt: occurrence.vernacularName || occurrence.scientificName
                    })}
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
      
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        alt={modalImage?.alt || ''}
      />
    </div>
  );
};

export default NearbySpecies; 