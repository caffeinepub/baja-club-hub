import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddAchievement } from '../hooks/useAchievements';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface AddAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAchievementModal({ isOpen, onClose }: AddAchievementModalProps) {
  const addAchievement = useAddAchievement();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
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

      await addAchievement.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        date,
        images,
      });

      toast.success('Achievement added successfully');
      setTitle('');
      setDescription('');
      setDate('');
      setImageFiles(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to add achievement:', error);
      toast.error('Failed to add achievement');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Achievement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Achievement title"
              disabled={addAchievement.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={addAchievement.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the achievement"
              rows={4}
              disabled={addAchievement.isPending}
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
              disabled={addAchievement.isPending}
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
              disabled={addAchievement.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addAchievement.isPending || !title.trim() || !description.trim() || !date}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addAchievement.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addAchievement.isPending ? 'Adding...' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
