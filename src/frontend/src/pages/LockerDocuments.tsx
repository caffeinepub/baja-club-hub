import { useState } from 'react';
import { useGetAllDocuments } from '../hooks/useLockerDocuments';
import DocumentCard from '../components/DocumentCard';
import AddDocumentModal from '../components/AddDocumentModal';
import { Loader2, Plus, FolderOpen, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';

export default function LockerDocuments() {
  const { data: documents = [], isLoading } = useGetAllDocuments();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.tags.toLowerCase().includes(query)
    );
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());

  return (
    <div className="container py-16">
      <div className="mb-6">
        <Link to="/member-locker" className="text-sm text-metallic-silver hover:text-racing-red transition-colors">
          ← Back to Member Locker
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <FolderOpen className="h-10 w-10 text-safety-orange" />
            Documents
          </h1>
          <p className="text-metallic-silver">Team documents and files</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {documents.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-metallic-silver" />
          <Input
            type="text"
            placeholder="Search documents by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {sortedDocuments.length === 0 ? (
        <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
          <FolderOpen className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
          <p className="text-metallic-silver">
            {searchQuery ? 'No documents match your search' : 'No documents uploaded yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
            >
              Upload First Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}

      <AddDocumentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
