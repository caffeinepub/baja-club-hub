import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2, Lock } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, loginStatus, login } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  if (isInitializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
          <p className="text-metallic-silver">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 bg-card border border-racing-red/20 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-racing-red/10 rounded-full">
              <Lock className="h-8 w-8 text-racing-red" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">Members Only</h2>
          <p className="text-metallic-silver mb-6">
            This section is restricted to team members. Please log in to access the member locker.
          </p>
          <button
            onClick={login}
            className="px-6 py-3 bg-racing-red hover:bg-racing-red/90 text-white rounded font-medium transition-colors"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
