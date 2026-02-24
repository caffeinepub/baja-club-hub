import type { Event } from '../backend';
import { Calendar, MapPin, Trash2 } from 'lucide-react';
import { useRemoveEvent } from '../hooks/useEvents';
import { toast } from 'sonner';

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  isPast?: boolean;
}

export default function EventCard({ event, isAdmin, isPast = false }: EventCardProps) {
  const removeEvent = useRemoveEvent();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      await removeEvent.mutateAsync(event.title);
      toast.success('Event deleted');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg overflow-hidden hover:border-racing-red/40 transition-all">
      {event.images && event.images.length > 0 && (
        <div className="aspect-video overflow-hidden bg-carbon-black">
          <img
            src={event.images[0].getDirectURL()}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0 w-14 text-center">
            <div className="text-2xl font-bold text-racing-red">
              {new Date(event.date).getDate()}
            </div>
            <div className="text-xs text-metallic-silver uppercase">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-metallic-silver mb-2">
              <Calendar className="h-4 w-4" />
              {new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-metallic-silver mb-3">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
          </div>
        </div>
        <p className="text-metallic-silver mb-4">{event.description}</p>
        {isAdmin && !isPast && (
          <button
            onClick={handleDelete}
            disabled={removeEvent.isPending}
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
