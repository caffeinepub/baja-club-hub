import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddPerson } from '../hooks/useTeamMembers';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTeamMemberModal({ isOpen, onClose }: AddTeamMemberModalProps) {
  const addPerson = useAddPerson();
  const [name, setName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [principalId, setPrincipalId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !roleDescription.trim() || !contactInfo.trim() || !principalId.trim() || !imageFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const principal = Principal.fromText(principalId.trim());
      
      const imageBytes = new Uint8Array(await imageFile.arrayBuffer());
      const imageBlob = ExternalBlob.fromBytes(imageBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addPerson.mutateAsync({
        id: principal,
        name: name.trim(),
        roleDescription: roleDescription.trim(),
        contactInfo: contactInfo.trim(),
        image: imageBlob,
      });

      toast.success('Team member added successfully');
      setName('');
      setRoleDescription('');
      setContactInfo('');
      setPrincipalId('');
      setImageFile(null);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to add team member:', error);
      toast.error('Failed to add team member. Check the Principal ID format.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              disabled={addPerson.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="principalId">Principal ID *</Label>
            <Input
              id="principalId"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              disabled={addPerson.isPending}
            />
            <p className="text-xs text-metallic-silver">Internet Computer Principal ID</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="e.g., Team Lead, Engineer"
              disabled={addPerson.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Info *</Label>
            <Textarea
              id="contact"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email, phone, or other contact details"
              rows={2}
              disabled={addPerson.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={addPerson.isPending}
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
              disabled={addPerson.isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addPerson.isPending || !name.trim() || !roleDescription.trim() || !contactInfo.trim() || !principalId.trim() || !imageFile}
              className="flex-1 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addPerson.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addPerson.isPending ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
