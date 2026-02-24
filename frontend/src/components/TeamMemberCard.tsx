import type { Person } from '../backend';
import { Mail, Trash2 } from 'lucide-react';
import { useRemovePerson } from '../hooks/useTeamMembers';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface TeamMemberCardProps {
  person: Person;
  isAdmin: boolean;
}

export default function TeamMemberCard({ person, isAdmin }: TeamMemberCardProps) {
  const removePerson = useRemovePerson();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${person.name}?`)) return;

    try {
      const principal = Principal.fromText(person.name);
      await removePerson.mutateAsync(principal);
      toast.success('Team member removed');
    } catch (error) {
      console.error('Failed to remove team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const imageUrl = person.image.getDirectURL();

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg overflow-hidden hover:border-racing-red/40 transition-all">
      <div className="aspect-square overflow-hidden bg-carbon-black">
        <img src={imageUrl} alt={person.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-foreground">{person.name}</h3>
        <p className="text-sm text-racing-red font-medium mb-3">{person.roleDescription}</p>
        {person.contactInfo && (
          <div className="flex items-center gap-2 text-sm text-metallic-silver mb-4">
            <Mail className="h-4 w-4" />
            {person.contactInfo}
          </div>
        )}
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={removePerson.isPending}
            className="w-full px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
