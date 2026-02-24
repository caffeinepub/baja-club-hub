import { useState } from 'react';
import { useGetAllEvents } from '../hooks/useEvents';
import { useIsCallerAdmin } from '../hooks/useQueries';
import EventCard from '../components/EventCard';
import AddEventModal from '../components/AddEventModal';
import { Loader2, Plus, Calendar } from 'lucide-react';

export default function Events() {
  const { data: events = [], isLoading } = useGetAllEvents();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const now = new Date();
  const upcomingEvents = sortedEvents.filter((event) => new Date(event.date) >= now);
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < now);

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Calendar className="h-10 w-10 text-safety-orange" />
            Events
          </h1>
          <p className="text-metallic-silver">Races, competitions, and team activities</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        )}
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-16 bg-card border border-racing-red/20 rounded-lg">
          <Calendar className="h-16 w-16 text-metallic-silver/30 mx-auto mb-4" />
          <p className="text-metallic-silver">No events scheduled</p>
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
            >
              Add First Event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Upcoming Events</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={index} event={event} isAdmin={isAdmin} />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-metallic-silver">Past Events</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60">
                {pastEvents.map((event, index) => (
                  <EventCard key={index} event={event} isAdmin={isAdmin} isPast />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
