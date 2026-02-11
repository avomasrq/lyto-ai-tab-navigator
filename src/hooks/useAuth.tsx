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
          await supabase.auth.signOut();
        } catch (error) {
          console.warn('Logout error (ignoring):', error);
          // Игнорируем ошибку — важно сбросить UI
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
    
    // Сбрасываем state
    setSession(null);
    setUser(null);
    
    // Уведомляем расширение
    window.postMessage({ type: 'SUPABASE_LOGOUT' }, '*');
    
    try {
      await supabase.auth.signOut();
      return { error: null };
    } catch (error) {
      console.warn('Logout error during account deletion (ignoring):', error);
      return { error: null }; // Игнорируем ошибку logout, т.к. аккаунт будет удалён
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
