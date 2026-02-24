import React from 'react';
import { useLockerAccessRequests, useApproveLockerAccessRequest, useDenyLockerAccessRequest } from '../hooks/useLockerAccessRequests';
import { RequestStatus } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}...${p.slice(-6)}`;
}

export default function LockerAccessRequestsPanel() {
  const { data: requests, isLoading, error } = useLockerAccessRequests();
  const approveMutation = useApproveLockerAccessRequest();
  const denyMutation = useDenyLockerAccessRequest();

  const handleApprove = async (requester: any) => {
    try {
      await approveMutation.mutateAsync(requester);
      toast.success('Access approved successfully.');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to approve request.');
    }
  };

  const handleDeny = async (requester: any) => {
    try {
      await denyMutation.mutateAsync(requester);
      toast.success('Access denied.');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to deny request.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Failed to load access requests. Make sure you are logged in as an admin.</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <p className="text-muted-foreground font-medium">No access requests yet.</p>
        <p className="text-sm text-muted-foreground">When members request locker access, they will appear here.</p>
      </div>
    );
  }

  const pending = requests.filter(r => r.status === RequestStatus.pending);
  const decided = requests.filter(r => r.status !== RequestStatus.pending);

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Requests ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((req) => {
              const principalStr = req.requester.toString();
              const isProcessing =
                (approveMutation.isPending && approveMutation.variables?.toString() === principalStr) ||
                (denyMutation.isPending && denyMutation.variables?.toString() === principalStr);

              return (
                <div
                  key={principalStr}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium text-foreground">{req.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground font-mono">{truncatePrincipal(principalStr)}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {formatTimestamp(req.requestTimestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-600 dark:text-yellow-400">
                      Pending
                    </Badge>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(req.requester)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeny(req.requester)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
                      Deny
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {decided.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Past Decisions ({decided.length})</h3>
          <div className="space-y-3">
            {decided.map((req) => {
              const principalStr = req.requester.toString();
              const isApproved = req.status === RequestStatus.approved;

              return (
                <div
                  key={principalStr}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card opacity-75"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium text-foreground">{req.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground font-mono">{truncatePrincipal(principalStr)}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {formatTimestamp(req.requestTimestamp)}
                    </p>
                    {req.decisionTimestamp && (
                      <p className="text-xs text-muted-foreground">
                        Decided: {formatTimestamp(req.decisionTimestamp)}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {isApproved ? (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Denied
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
