import type { LockerDocument } from '../backend';
import { Calendar, Download, FileText, Trash2, User } from 'lucide-react';
import { useDeleteDocument } from '../hooks/useLockerDocuments';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';

interface DocumentCardProps {
  document: LockerDocument;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const deleteDocument = useDeleteDocument();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${document.title}"?`)) return;

    try {
      await deleteDocument.mutateAsync(document.id);
      toast.success('Document deleted');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = () => {
    const url = document.file.getDirectURL();
    window.open(url, '_blank');
  };

  const tags = document.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg p-6 hover:border-racing-red/40 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-safety-orange/10 rounded-lg">
          <FileText className="h-6 w-6 text-safety-orange" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">{document.title}</h3>
          <p className="text-sm text-metallic-silver mb-3">{document.description}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-metallic-silver">
          <Calendar className="h-4 w-4" />
          {new Date(document.dateUploaded).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-metallic-silver">
          <User className="h-4 w-4" />
          {userProfile?.name || document.author.toString().slice(0, 8) + '...'}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-racing-red/10 text-racing-red text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 px-3 py-2 bg-racing-red/10 hover:bg-racing-red/20 text-racing-red rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleteDocument.isPending}
            className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
