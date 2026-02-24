import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLockerAccessStatus, useSubmitLockerAccessRequest } from '../hooks/useLockerAccess';
import { useIsCallerAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { RequestStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lock, Clock, XCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface LockerAccessGateProps {
  children: React.ReactNode;
}

export default function LockerAccessGate({ children }: LockerAccessGateProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'logging-in';

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: accessStatus, isLoading: statusLoading } = useLockerAccessStatus();
  const { data: userProfile } = useGetCallerUserProfile();
  const submitRequest = useSubmitLockerAccessRequest();

  const [customName, setCustomName] = useState('');

  const handleRequestAccess = async () => {
    const name = userProfile?.name || customName.trim();
    if (!name) {
      toast.error('Please enter your name to request access.');
      return;
    }
    try {
      await submitRequest.mutateAsync(name);
      toast.success('Access request submitted! An admin will review it shortly.');
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes('already have a pending request')) {
        toast.info('You already have a pending access request.');
      } else if (msg.includes('Access already granted')) {
        toast.info('You already have access to the locker.');
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    }
  };

  // Show loading while initializing or checking access
  if (isInitializing || (isAuthenticated && (adminLoading || statusLoading))) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Checking access...</p>
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
            <div className="p-4 rounded-full bg-primary/10">
              <Lock className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Member Locker</h2>
            <p className="text-muted-foreground">
              You need to log in to access the Member Locker. Please log in using the button in the top navigation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin always has access
  if (isAdmin) {
    return <>{children}</>;
  }

  // Approved user
  if (accessStatus === RequestStatus.approved) {
    return <>{children}</>;
  }

  // Pending request
  if (accessStatus === RequestStatus.pending) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-yellow-500/10">
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
          <Alert className="border-yellow-500/30 bg-yellow-500/5 text-left">
            <Clock className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-600 dark:text-yellow-400">Request Pending</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Your access request has been submitted and is awaiting admin approval. You'll be able to access the Member Locker once approved.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Denied request
  if (accessStatus === RequestStatus.denied) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <Alert variant="destructive" className="text-left">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Your access request was denied. Please contact an admin if you believe this is a mistake.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No request yet — show request form
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Request Locker Access</h2>
          <p className="text-muted-foreground">
            The Member Locker contains private team resources. Request access from an admin to get started.
          </p>
        </div>

        {!userProfile?.name && (
          <div className="text-left space-y-2">
            <label className="text-sm font-medium text-foreground">Your Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {userProfile?.name && (
          <p className="text-sm text-muted-foreground">
            Requesting as: <span className="font-medium text-foreground">{userProfile.name}</span>
          </p>
        )}

        <Button
          onClick={handleRequestAccess}
          disabled={submitRequest.isPending || (!userProfile?.name && !customName.trim())}
          className="w-full"
        >
          {submitRequest.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Request Access'
          )}
        </Button>
      </div>
    </div>
  );
}
