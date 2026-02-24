import { useState } from 'react';
import type { LockerDocument } from '../backend';
import PhotoLightbox from './PhotoLightbox';

interface PhotoGalleryProps {
  photos: LockerDocument[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime()
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPhotos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhotoIndex(index)}
            className="aspect-square overflow-hidden rounded-lg bg-carbon-black border border-racing-red/20 hover:border-racing-red/40 transition-all group"
          >
            <img
              src={photo.file.getDirectURL()}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={sortedPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </>
  );
}
