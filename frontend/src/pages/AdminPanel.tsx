import React from 'react';
import { Shield, MessageSquare, Users, Loader2, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useGetAllFeedback } from '../hooks/useFeedback';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LockerAccessRequestsPanel from '../components/LockerAccessRequestsPanel';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}...${p.slice(-6)}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  bug: 'bg-red-500/15 text-red-400 border-red-500/30',
  feature: 'bg-green-500/15 text-green-400 border-green-500/30',
  other: 'bg-muted text-muted-foreground border-border',
};

export default function AdminPanel() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, isFetched: adminFetched } = useIsCallerAdmin();
  const { data: feedbackEntries, isLoading: feedbackLoading, error: feedbackError } = useGetAllFeedback();

  const isAuthenticated = !!identity;

  // Show loading while identity or admin status is being determined
  if (isInitializing || adminLoading || !adminFetched) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="p-4 rounded-full bg-muted inline-flex mb-4">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground text-sm">
            You must be logged in as an admin to access this panel.
          </p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="p-4 rounded-full bg-destructive/10 inline-flex mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            You do not have admin privileges to view this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero */}
      <div className="bg-carbon-black border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">
                Manage access requests and review member feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="feedback">
          <TabsList className="mb-6 bg-carbon-black border border-border/60">
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
              {feedbackEntries && feedbackEntries.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  {feedbackEntries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Access Requests
            </TabsTrigger>
          </TabsList>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            {feedbackLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading feedback...</span>
              </div>
            ) : feedbackError ? (
              <div className="text-center py-16 text-destructive">
                <p>Failed to load feedback. Make sure you are logged in as an admin.</p>
              </div>
            ) : !feedbackEntries || feedbackEntries.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-muted">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground font-medium">No feedback submitted yet.</p>
                <p className="text-sm text-muted-foreground">
                  When members submit feedback, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...feedbackEntries]
                  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .map((entry) => {
                    const principalStr = entry.submitter.toString();
                    const categoryColor =
                      CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS['other'];
                    return (
                      <div
                        key={entry.id.toString()}
                        className="p-4 rounded-xl border border-border bg-card space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${categoryColor}`}
                            >
                              {entry.category}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {truncatePrincipal(principalStr)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {entry.message}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="requests">
            <LockerAccessRequestsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
