import type { DriveLink } from '../backend';
import { Calendar, ExternalLink, Trash2, User } from 'lucide-react';
import { useDeleteDriveLink } from '../hooks/useLockerDriveLinks';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';

interface DriveLinkCardProps {
  driveLink: DriveLink;
}

export default function DriveLinkCard({ driveLink }: DriveLinkCardProps) {
  const deleteDriveLink = useDeleteDriveLink();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${driveLink.title}"?`)) return;

    try {
      await deleteDriveLink.mutateAsync(driveLink.id);
      toast.success('Drive link deleted');
    } catch (error) {
      console.error('Failed to delete drive link:', error);
      toast.error('Failed to delete drive link');
    }
  };

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg p-6 hover:border-racing-red/40 transition-all">
      <h3 className="text-lg font-bold text-foreground mb-3">{driveLink.title}</h3>
      
      {driveLink.description && (
        <p className="text-sm text-metallic-silver mb-4">{driveLink.description}</p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-metallic-silver">
          <Calendar className="h-4 w-4" />
          {new Date(driveLink.dateAdded).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-metallic-silver">
          <User className="h-4 w-4" />
          {userProfile?.name || driveLink.author.toString().slice(0, 8) + '...'}
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={driveLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 bg-racing-red/10 hover:bg-racing-red/20 text-racing-red rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open Link
        </a>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleteDriveLink.isPending}
            className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
