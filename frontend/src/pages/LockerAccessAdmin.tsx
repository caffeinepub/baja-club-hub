import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import LockerAccessRequestsPanel from '../components/LockerAccessRequestsPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert, Loader2 } from 'lucide-react';

export default function LockerAccessAdmin() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Unauthorized</h2>
            <p className="text-muted-foreground">
              You do not have permission to view this page. Only admins can manage locker access requests.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/locker' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Member Locker
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/locker' })}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Member Locker
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Manage locker access requests from team members.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <LockerAccessRequestsPanel />
      </div>
    </div>
  );
}
