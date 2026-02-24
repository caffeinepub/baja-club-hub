import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAddDocument } from '../hooks/useLockerDocuments';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPhotoModal({ isOpen, onClose }: AddPhotoModalProps) {
  const addDocument = useAddDocument();
  const { identity } = useInternetIdentity();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      toast.error('Please select at least one photo');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileBytes = new Uint8Array(await file.arrayBuffer());
        const fileBlob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });

        return addDocument.mutateAsync({
          id: `photo-${Date.now()}-${Math.random()}`,
          title: file.name,
          description: 'Photo',
          tags: 'photo,image',
          dateUploaded: new Date().toISOString(),
          author: identity.getPrincipal(),
          file: fileBlob,
        });
      });

      await Promise.all(uploadPromises);

      toast.success(`${files.length} photo(s) uploaded successfully`);
      setFiles(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to upload photos:', error);
      toast.error('Failed to upload photos');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photos">Select Photos *</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              disabled={addDocument.isPending}
            />
            <p className="text-xs text-metallic-silver">You can select multiple photos</p>
          </div>

          {files && files.length > 0 && (
            <p className="text-sm text-metallic-silver">{files.length} photo(s) selected</p>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-racing-red transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-center text-metallic-silver">{uploadProgress}% uploaded</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={addDocument.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addDocument.isPending || !files || files.length === 0}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addDocument.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addDocument.isPending ? 'Uploading...' : 'Upload Photos'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
