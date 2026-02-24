import { Link } from '@tanstack/react-router';
import { Trophy, Calendar, Lock, Users } from 'lucide-react';
import UpcomingEventsPreview from '../components/UpcomingEventsPreview';

export default function Home() {
  const navigationCards = [
    {
      to: '/about-team',
      title: 'Our Team',
      description: 'Meet the talented individuals behind our success',
      icon: Users,
      color: 'from-racing-red/20 to-racing-red/5',
    },
    {
      to: '/achievements',
      title: 'Achievements',
      description: 'Celebrating our victories and milestones',
      icon: Trophy,
      color: 'from-championship-gold/20 to-championship-gold/5',
      image: '/assets/generated/achievement-icon.dim_128x128.png',
    },
    {
      to: '/events',
      title: 'Events',
      description: 'Upcoming races, competitions, and team activities',
      icon: Calendar,
      color: 'from-safety-orange/20 to-safety-orange/5',
      image: '/assets/generated/events-icon.dim_128x128.png',
    },
    {
      to: '/member-locker',
      title: 'Member Locker',
      description: 'Secure access to team documents and resources',
      icon: Lock,
      color: 'from-metallic-silver/20 to-metallic-silver/5',
      image: '/assets/generated/locker-icon.dim_128x128.png',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/baja-hero.jpg"
          alt="Baja Racing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-black via-carbon-black/70 to-transparent">
          <div className="container h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-tight">
                VVCEBAJA
              </h1>
              <p className="text-xl text-metallic-silver mb-6">
                Engineering excellence. Racing passion. Team spirit.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/about-team"
                  className="px-6 py-3 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
                >
                  Meet the Team
                </Link>
                <Link
                  to="/achievements"
                  className="px-6 py-3 bg-metallic-silver/10 hover:bg-metallic-silver/20 text-metallic-silver border border-metallic-silver/30 rounded font-medium transition-colors"
                >
                  View Achievements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative overflow-hidden rounded-lg border border-racing-red/20 bg-card hover:border-racing-red/40 transition-all hover:shadow-lg hover:shadow-racing-red/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50`} />
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-racing-red/10 rounded-lg group-hover:bg-racing-red/20 transition-colors">
                    <card.icon className="h-6 w-6 text-racing-red" />
                  </div>
                  {card.image && (
                    <img src={card.image} alt={card.title} className="h-12 w-12 opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{card.title}</h3>
                <p className="text-sm text-metallic-silver">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="container pb-16">
        <UpcomingEventsPreview />
      </section>
    </div>
  );
}
