import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddEquipment } from '../hooks/useLockerEquipment';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEquipmentModal({ isOpen, onClose }: AddEquipmentModalProps) {
  const addEquipment = useAddEquipment();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !quantity.trim() || !unitPrice.trim() || !purchaseDate || !imageFile) {
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

      await addEquipment.mutateAsync({
        id: `equipment-${Date.now()}`,
        name: name.trim(),
        quantity: quantity.trim(),
        unitPrice: unitPrice.trim(),
        purchaseDate,
        description: description.trim(),
        comments: comments.trim(),
        image: imageBlob,
        addedBy: identity.getPrincipal(),
      });

      toast.success('Equipment added successfully');
      setName('');
      setQuantity('');
      setUnitPrice('');
      setPurchaseDate('');
      setDescription('');
      setComments('');
      setImageFile(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to add equipment:', error);
      toast.error('Failed to add equipment');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Equipment name"
              disabled={addEquipment.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                disabled={addEquipment.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="$0.00"
                disabled={addEquipment.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              disabled={addEquipment.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Equipment details"
              rows={2}
              disabled={addEquipment.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional notes"
              rows={2}
              disabled={addEquipment.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Equipment Image *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={addEquipment.isPending}
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
              disabled={addEquipment.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addEquipment.isPending || !name.trim() || !quantity.trim() || !unitPrice.trim() || !purchaseDate || !imageFile}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addEquipment.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addEquipment.isPending ? 'Adding...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
