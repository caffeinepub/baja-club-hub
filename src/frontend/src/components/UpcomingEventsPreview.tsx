import { useGetAllEvents } from '../hooks/useEvents';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function UpcomingEventsPreview() {
  const { data: events = [], isLoading } = useGetAllEvents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-racing-red" />
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-racing-red/20 rounded-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 text-safety-orange" />
          Upcoming Events
        </h2>
        <Link to="/events" className="text-sm text-racing-red hover:underline">
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="flex gap-4 p-4 bg-background/50 rounded border border-racing-red/10 hover:border-racing-red/30 transition-colors">
            <div className="flex-shrink-0 w-16 text-center">
              <div className="text-2xl font-bold text-racing-red">
                {new Date(event.date).getDate()}
              </div>
              <div className="text-xs text-metallic-silver uppercase">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
              <p className="text-sm text-metallic-silver line-clamp-2 mb-2">{event.description}</p>
              {event.location && (
                <div className="flex items-center gap-1 text-xs text-metallic-silver">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
