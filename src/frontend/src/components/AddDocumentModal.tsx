import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddDocument } from '../hooks/useLockerDocuments';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDocumentModal({ isOpen, onClose }: AddDocumentModalProps) {
  const addDocument = useAddDocument();
  const { identity } = useInternetIdentity();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !file) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const fileBlob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addDocument.mutateAsync({
        id: `doc-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        tags: tags.trim(),
        dateUploaded: new Date().toISOString(),
        author: identity.getPrincipal(),
        file: fileBlob,
      });

      toast.success('Document uploaded successfully');
      setTitle('');
      setDescription('');
      setTags('');
      setFile(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              disabled={addDocument.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the document"
              rows={3}
              disabled={addDocument.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., budget, technical, report"
              disabled={addDocument.isPending}
            />
            <p className="text-xs text-metallic-silver">Separate tags with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={addDocument.isPending}
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
              disabled={addDocument.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addDocument.isPending || !title.trim() || !description.trim() || !file}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addDocument.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addDocument.isPending ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
