import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LockerAccessRequestsPanel from '../components/LockerAccessRequestsPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert, Loader2 } from 'lucide-react';

export default function LockerAccessAdmin() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, isFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Show loading while:
  // - identity provider is still initializing (restoring stored session)
  // - actor is being created / admin check is in flight
  // - authenticated but the admin check hasn't completed yet
  const showLoading = isInitializing || adminLoading || (isAuthenticated && !isFetched);

  if (showLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground">
              Please log in to access the admin panel.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Logged in but not admin
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              Admin privileges required. You do not have permission to view this page.
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
