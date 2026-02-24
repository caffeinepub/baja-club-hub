import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddBill } from '../hooks/useLockerBills';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBillModal({ isOpen, onClose }: AddBillModalProps) {
  const addBill = useAddBill();
  const { identity } = useInternetIdentity();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !amount.trim() || !date || !imageFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const imageBytes = new Uint8Array(await imageFile.arrayBuffer());
      const imageBlob = ExternalBlob.fromBytes(imageBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addBill.mutateAsync({
        id: `bill-${Date.now()}`,
        title: title.trim(),
        amount: amount.trim(),
        date,
        comments: comments.trim(),
        author: identity.getPrincipal(),
        image: imageBlob,
      });

      toast.success('Bill uploaded successfully');
      setTitle('');
      setAmount('');
      setDate('');
      setComments('');
      setImageFile(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to upload bill:', error);
      toast.error('Failed to upload bill');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Bill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bill description"
              disabled={addBill.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$0.00"
              disabled={addBill.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={addBill.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional notes"
              rows={3}
              disabled={addBill.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Bill Image *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={addBill.isPending}
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
              disabled={addBill.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addBill.isPending || !title.trim() || !amount.trim() || !date || !imageFile}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addBill.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addBill.isPending ? 'Uploading...' : 'Upload Bill'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
