import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbjnwrzqjwfyjmowkcvr.supabase.co';

    const postSessionToExtension = (session: Session | null) => {
      if (session?.access_token && session?.refresh_token) {
        window.postMessage(
          {
            type: 'SUPABASE_AUTH',
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          },
          '*'
        );
      }
    };

    const syncUserToDb = async (session: Session | null) => {
      if (!session?.access_token) return;
      try {
        await fetch(`${supabaseUrl}/functions/v1/sync-user`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: '{}',
        });
      } catch {
        // Ignore — user may still be created by trigger
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        postSessionToExtension(session);
        if (session) syncUserToDb(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      postSessionToExtension(session);
      if (session) syncUserToDb(session);
    });

    const handleExtensionLogout = async (event: MessageEvent) => {
      if (event.data?.type === 'LYTO_EXTENSION_LOGOUT') {
        console.log('Extension logout signal received');
        // Сбрасываем state сразу, даже если signOut упадёт с 403
        setSession(null);
        setUser(null);
        
        try {
          // scope:'local' — extension already called full signOut(), we just clear local state
          await supabase.auth.signOut({ scope: 'local' });
        } catch (error) {
          console.warn('Logout error (ignoring):', error);
        }
      }
    };
    window.addEventListener('message', handleExtensionLogout);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('message', handleExtensionLogout);
    };
  }, []);

  const signInWithGoogle = async () => {
    // Redirect to /auth so OAuth callback lands on auth page (extension flow)
    const redirectUrl = `${window.location.origin}/auth`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  const signOut = async () => {
    console.log('Signing out from landing...');
    
    // Сбрасываем state сразу, чтобы UI обновился немедленно
    setSession(null);
    setUser(null);
    
    // Уведомляем расширение о выходе
    window.postMessage({ type: 'SUPABASE_LOGOUT' }, '*');
    
    try {
      // Пытаемся выйти через Supabase (может вернуть 403, если токен протух)
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Logout error (ignoring):', error);
      // Игнорируем ошибку — главное, что мы сбросили state и уведомили extension
    }
  };

  const deleteAccount = async () => {
    console.log('Deleting account...');

    // Real deletion runs on the backend: it cancels billing, clears server-side
    // sessions, and cascades the DB wipe + removes the Supabase auth user.
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.trylyto.com';
      const { data: { session: fresh } } = await supabase.auth.getSession();
      const token = fresh?.access_token;
      if (!token) return { error: new Error('You are not signed in') };

      const res = await fetch(`${apiUrl}/api/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Echoed email is a safety confirmation checked by the backend.
        body: JSON.stringify({ email: fresh?.user?.email ?? user?.email ?? '' }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({} as { message?: string }));
        return { error: new Error(detail?.message || 'Failed to delete account') };
      }

      // Server confirmed erasure — tear down the (now-invalid) local session.
      setSession(null);
      setUser(null);
      window.postMessage({ type: 'SUPABASE_LOGOUT' }, '*');
      await supabase.auth.signOut().catch(() => {});
      return { error: null };
    } catch (error) {
      console.error('Account deletion failed:', error);
      return { error: error instanceof Error ? error : new Error('Failed to delete account') };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
