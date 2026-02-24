import { useState } from 'react';
import { useGetAllPeople, useAddPerson, useUpdatePerson, useRemovePerson } from '../hooks/useTeamMembers';
import { useIsCallerAdmin } from '../hooks/useQueries';
import TeamMemberCard from '../components/TeamMemberCard';
import AddTeamMemberModal from '../components/AddTeamMemberModal';
import { Loader2, Plus, Users } from 'lucide-react';

export default function AboutTeam() {
  const { data: people = [], isLoading } = useGetAllPeople();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Users className="h-10 w-10 text-racing-red" />
            Our Team
          </h1>
          <p className="text-metallic-silver">Meet the talented individuals driving our success</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        )}
      </div>

      {people.length === 0 ? (
        <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
          <Users className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
          <p className="text-metallic-silver">No team members yet</p>
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
            >
              Add First Member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person, index) => (
            <TeamMemberCard key={index} person={person} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      <AddTeamMemberModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
