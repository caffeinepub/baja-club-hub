import { useState } from 'react';
import { useGetAllDocuments } from '../hooks/useLockerDocuments';
import PhotoGallery from '../components/PhotoGallery';
import AddPhotoModal from '../components/AddPhotoModal';
import { Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import LockerAccessGate from '../components/LockerAccessGate';

export default function LockerPhotos() {
  const { data: documents = [], isLoading } = useGetAllDocuments();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  const photos = documents.filter((doc) => doc.tags.toLowerCase().includes('photo') || doc.tags.toLowerCase().includes('image'));

  return (
    <LockerAccessGate>
      <div className="container py-16">
        <div className="mb-6">
          <Link to="/locker" className="text-sm text-metallic-silver hover:text-racing-red transition-colors">
            ← Back to Member Locker
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
              <ImageIcon className="h-10 w-10 text-metallic-silver" />
              Photos
            </h1>
            <p className="text-metallic-silver">Team photo gallery</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Photos
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
            <ImageIcon className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
            <p className="text-metallic-silver">No photos uploaded yet</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
            >
              Upload First Photo
            </button>
          </div>
        ) : (
          <PhotoGallery photos={photos} />
        )}

        <AddPhotoModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </LockerAccessGate>
  );
}
