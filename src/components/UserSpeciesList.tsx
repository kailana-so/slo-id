"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDate, sentenceCase } from '@/utils/helpers';
import { SpeciesOccurrence } from '@/types/species';
import { MapPin } from '@/types/map';
import { Routes } from '@/enums/routes';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ImageModal from './common/ImageModal';
import { format } from 'date-fns';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface UserSpeciesListProps {
  species: SpeciesOccurrence[];
  userNotes: MapPin[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const UserSpeciesList: React.FC<UserSpeciesListProps> = ({ species, userNotes, loading, error, onRetry }) => {
  const router = useRouter();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; imageId?: string; userId?: string } | null>(null);
  const [userNotesExpanded, setUserNotesExpanded] = useState(false);



  const handleSeeOnMap = (occurrence: SpeciesOccurrence) => {
    // Navigate to the profile map page with coordinates and species info as URL parameters
    const params = new URLSearchParams({
      lat: occurrence.decimalLatitude.toString(),
      lng: occurrence.decimalLongitude.toString(),
      name: occurrence.vernacularName || occurrence.scientificName || 'Unknown',
      scientificName: occurrence.scientificName || '',
      ...(occurrence.species && { species: occurrence.species }),
      ...(occurrence.thumbnailUrl && { image: occurrence.thumbnailUrl })
    });
    router.push(`${Routes.USERMAP}?${params.toString()}`);
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
      {/* User Notes Section */}
      {userNotes.length > 0 && (
        <div className="mb-6">
          <div 
            className="mb-4 cursor-pointer flex justify-between content-end"
            onClick={() => setUserNotesExpanded(!userNotesExpanded)}
          >
            <div>
              <h4>Your Notes ({userNotes.length})</h4>
              <p className="inline">Within 2km</p>
            </div>
            <div className="note-divider" style={{ width: "50%", margin: "0 5% 0 5%", marginTop: "12px" }}></div>
            <span>{userNotesExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</span>
          </div>
          {userNotesExpanded && <div>
            {userNotes.map((note) => (
              <div key={note.id} className="card">
                <section className="aligned content-center">
                  {note.thumbnailUrl && (
                    <Image
                      src={note.thumbnailUrl}
                      width={50}
                      height={50}
                      alt={note.name || note.type}
                      className="object-cover rounded-sm"
                      onClick={() => setModalImage({
                        src: note.thumbnailUrl!,
                        alt: note.name || note.type
                      })}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h4>{sentenceCase(note.type)}</h4>
                    {note.name && <p>{note.name}</p>}
                    <p>{format(note.createdAt, "dd MMM yyyy")}</p>
                    <div className="content-center gap-4 flex flex-row pt-2">
                      <button 
                        className="flex items-end gap-2"
                        onClick={() => {
                          const params = new URLSearchParams({
                            lat: note.latitude.toString(),
                            lng: note.longitude.toString(),
                            type: note.type,
                            ...(note.name && { name: note.name }),
                            ...(note.thumbnailUrl && { image: note.thumbnailUrl }),
                            date: format(note.createdAt, "dd MMM yyyy")
                          });
                          router.push(`${Routes.USERMAP}?${params.toString()}`);
                        }}
                      >
                        <h4>See on map</h4> 
                        <NavigateNextIcon></NavigateNextIcon>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* ALA Species Section */}
      <div className="mb-4">
        <h4>Nearby Species ({species.length})</h4>
        <p>Within 2km</p>
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
                        onClick={() => handleSeeOnMap(occurrence)}
                        className="flex items-end gap-2"
                    >
                        <h4>See on map</h4> 
                        <NavigateNextIcon></NavigateNextIcon>
                    </button>
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

export default UserSpeciesList; 