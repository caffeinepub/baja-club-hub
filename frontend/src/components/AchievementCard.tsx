import type { Achievement } from '../backend';
import { Calendar, Trash2 } from 'lucide-react';
import { useRemoveAchievement } from '../hooks/useAchievements';
import { toast } from 'sonner';

interface AchievementCardProps {
  achievement: Achievement;
  isAdmin: boolean;
}

export default function AchievementCard({ achievement, isAdmin }: AchievementCardProps) {
  const removeAchievement = useRemoveAchievement();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${achievement.title}"?`)) return;

    try {
      await removeAchievement.mutateAsync(achievement.title);
      toast.success('Achievement deleted');
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      toast.error('Failed to delete achievement');
    }
  };

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg overflow-hidden hover:border-racing-red/40 transition-all">
      {achievement.images && achievement.images.length > 0 && (
        <div className="aspect-video overflow-hidden bg-carbon-black">
          <img
            src={achievement.images[0].getDirectURL()}
            alt={achievement.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground flex-1">{achievement.title}</h3>
          <div className="flex items-center gap-2 text-sm text-metallic-silver">
            <Calendar className="h-4 w-4" />
            {new Date(achievement.date).toLocaleDateString()}
          </div>
        </div>
        <p className="text-metallic-silver mb-4">{achievement.description}</p>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={removeAchievement.isPending}
            className="w-full px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
