import { useEffect } from 'react';
import type { LockerDocument } from '../backend';
import { X, ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-react';
import { useDeleteDocument } from '../hooks/useLockerDocuments';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';

interface PhotoLightboxProps {
  photos: LockerDocument[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
  const deleteDocument = useDeleteDocument();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${currentPhoto.title}"?`)) return;

    try {
      await deleteDocument.mutateAsync(currentPhoto.id);
      toast.success('Photo deleted');
      if (photos.length === 1) {
        onClose();
      } else if (currentIndex === photos.length - 1) {
        onNavigate(currentIndex - 1);
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const handleDownload = () => {
    const url = currentPhoto.file.getDirectURL();
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-carbon-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-racing-red/10 hover:bg-racing-red/20 text-white rounded-full transition-colors z-10"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 p-2 bg-racing-red/10 hover:bg-racing-red/20 text-white rounded-full transition-colors z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 p-2 bg-racing-red/10 hover:bg-racing-red/20 text-white rounded-full transition-colors z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <img
          src={currentPhoto.file.getDirectURL()}
          alt={currentPhoto.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-carbon-black/90 border-t border-racing-red/20 p-4">
        <div className="container flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">{currentPhoto.title}</h3>
            <p className="text-sm text-metallic-silver">{currentPhoto.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-racing-red/10 hover:bg-racing-red/20 text-racing-red rounded font-medium transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleteDocument.isPending}
                className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
