import { Link } from '@tanstack/react-router';
import { FileText, Package, FolderOpen, Image, Link as LinkIcon, Lock, ShieldAlert } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import LockerAccessGate from '../components/LockerAccessGate';

export default function MemberLocker() {
  const { data: isAdmin } = useIsCallerAdmin();

  const lockerSections = [
    {
      to: '/locker/bills' as const,
      title: 'Bills',
      description: 'Financial records and receipts',
      icon: FileText,
      color: 'from-racing-red/20 to-racing-red/5',
    },
    {
      to: '/locker/equipment' as const,
      title: 'Equipment',
      description: 'Purchased equipment inventory',
      icon: Package,
      color: 'from-championship-gold/20 to-championship-gold/5',
    },
    {
      to: '/locker/documents' as const,
      title: 'Documents',
      description: 'Team documents and files',
      icon: FolderOpen,
      color: 'from-safety-orange/20 to-safety-orange/5',
    },
    {
      to: '/locker/photos' as const,
      title: 'Photos',
      description: 'Team photo gallery',
      icon: Image,
      color: 'from-metallic-silver/20 to-metallic-silver/5',
    },
    {
      to: '/locker/drive-links' as const,
      title: 'Drive Links',
      description: 'External storage links',
      icon: LinkIcon,
      color: 'from-racing-red/20 to-racing-red/5',
    },
  ];

  return (
    <LockerAccessGate>
      <div className="container py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Lock className="h-10 w-10 text-racing-red" />
            Member Locker
          </h1>
          <p className="text-metallic-silver">Secure access to team resources and documents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockerSections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="group relative overflow-hidden rounded-lg border border-racing-red/20 bg-card hover:border-racing-red/40 transition-all hover:shadow-lg hover:shadow-racing-red/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-50`} />
              <div className="relative p-6 flex flex-col h-full">
                <div className="p-3 bg-racing-red/10 rounded-lg group-hover:bg-racing-red/20 transition-colors w-fit mb-4">
                  <section.icon className="h-8 w-8 text-racing-red" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{section.title}</h3>
                <p className="text-sm text-metallic-silver">{section.description}</p>
              </div>
            </Link>
          ))}

          {/* Admin-only: Locker Access Management */}
          {isAdmin && (
            <Link
              to="/locker/access-admin"
              className="group relative overflow-hidden rounded-lg border border-racing-red/40 bg-card hover:border-racing-red/70 transition-all hover:shadow-lg hover:shadow-racing-red/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-racing-red/30 to-racing-red/5 opacity-50" />
              <div className="relative p-6 flex flex-col h-full">
                <div className="p-3 bg-racing-red/20 rounded-lg group-hover:bg-racing-red/30 transition-colors w-fit mb-4">
                  <ShieldAlert className="h-8 w-8 text-racing-red" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Access Requests</h3>
                <p className="text-sm text-metallic-silver">Manage member locker access requests</p>
                <span className="mt-3 text-xs font-semibold text-racing-red uppercase tracking-widest">Admin Only</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </LockerAccessGate>
  );
}
