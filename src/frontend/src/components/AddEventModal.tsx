import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddEvent } from '../hooks/useEvents';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const addEvent = useAddEvent();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let images: ExternalBlob[] | undefined;

      if (imageFiles && imageFiles.length > 0) {
        images = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const imageBytes = new Uint8Array(await file.arrayBuffer());
          const imageBlob = ExternalBlob.fromBytes(imageBytes).withUploadProgress((percentage) => {
            setUploadProgress(percentage);
          });
          images.push(imageBlob);
        }
      }

      await addEvent.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        date,
        location: location.trim() || undefined,
        images,
      });

      toast.success('Event added successfully');
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImageFiles(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to add event:', error);
      toast.error('Failed to add event');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              disabled={addEvent.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={addEvent.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
              disabled={addEvent.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event"
              rows={4}
              disabled={addEvent.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files)}
              disabled={addEvent.isPending}
            />
          </div>

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
              disabled={addEvent.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addEvent.isPending || !title.trim() || !description.trim() || !date}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addEvent.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addEvent.isPending ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
