'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface User {
  id: string;
  email: string;
  user_metadata: {
    role?: string;
    name?: string;
  };
}

interface Session {
  access_token: string;
  expires_at: number;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, role?: string) => Promise<{ success: boolean; userId?: string; error?: string }>;
  signInWithOAuth: (provider: string, redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  hasRole: (role: string) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fetch the current session
  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // Refresh session data
      await fetchSession();
      
      // Check for redirect
      const redirectTo = searchParams.get('redirectTo') || '/app/dashboard';
      router.push(redirectTo);
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, role: string = 'customer') => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      setLoading(false);
      return { success: true, userId: data.userId };
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      };
    }
  };

  // Sign in with OAuth provider
  const signInWithOAuth = async (provider: string, redirectTo?: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          provider, 
          redirectTo: redirectTo || `${window.location.origin}/auth/callback?redirect=${pathname}` 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate OAuth sign in');
      }

      // Redirect to the OAuth provider
      window.location.href = data.url;
      return { success: true };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OAuth sign in failed' 
      };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/signout', { method: 'POST' });
      
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      router.push('/');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      };
    }
  };

  // Check user role
  const hasRole = (role: string) => {
    return user?.user_metadata?.role === role;
  };

  // Initialize auth state on mount
  useEffect(() => {
    fetchSession();
  }, []);

  // Listen for auth callback
  useEffect(() => {
    if (pathname === '/auth/callback') {
      fetchSession();
      const redirectTo = searchParams.get('redirect') || '/app/dashboard';
      router.push(redirectTo);
    }
  }, [pathname, searchParams, router]);

  const value = {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    hasRole,
    refreshSession: fetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 