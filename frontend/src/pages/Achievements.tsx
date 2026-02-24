import { useState } from 'react';
import { useGetAllAchievements } from '../hooks/useAchievements';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AchievementCard from '../components/AchievementCard';
import AddAchievementModal from '../components/AddAchievementModal';
import { Loader2, Plus, Trophy } from 'lucide-react';

export default function Achievements() {
  const { data: achievements = [], isLoading } = useGetAllAchievements();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  const sortedAchievements = [...achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Trophy className="h-10 w-10 text-championship-gold" />
            Achievements
          </h1>
          <p className="text-metallic-silver">Celebrating our victories and milestones</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </button>
        )}
      </div>

      {sortedAchievements.length === 0 ? (
        <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
          <Trophy className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
          <p className="text-metallic-silver">No achievements yet</p>
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
            >
              Add First Achievement
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedAchievements.map((achievement, index) => (
            <AchievementCard key={index} achievement={achievement} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      <AddAchievementModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
