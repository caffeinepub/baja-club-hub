import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddDriveLink } from '../hooks/useLockerDriveLinks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface AddDriveLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDriveLinkModal({ isOpen, onClose }: AddDriveLinkModalProps) {
  const addDriveLink = useAddDriveLink();
  const { identity } = useInternetIdentity();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isValidUrl(url.trim())) {
      toast.error('Please enter a valid URL');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in');
      return;
    }

    try {
      await addDriveLink.mutateAsync({
        id: `link-${Date.now()}`,
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        dateAdded: new Date().toISOString(),
        author: identity.getPrincipal(),
      });

      toast.success('Drive link added successfully');
      setTitle('');
      setUrl('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to add drive link:', error);
      toast.error('Failed to add drive link');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Drive Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title"
              disabled={addDriveLink.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              disabled={addDriveLink.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this link contains"
              rows={3}
              disabled={addDriveLink.isPending}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={addDriveLink.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addDriveLink.isPending || !title.trim() || !url.trim()}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addDriveLink.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addDriveLink.isPending ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
