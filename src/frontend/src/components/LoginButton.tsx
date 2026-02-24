import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium text-sm transition-all flex items-center gap-2 ${
        isAuthenticated
          ? 'bg-metallic-silver/10 hover:bg-metallic-silver/20 text-metallic-silver border border-metallic-silver/30'
          : 'bg-racing-red hover:bg-racing-red/90 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {disabled && <Loader2 className="h-4 w-4 animate-spin" />}
      {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}
