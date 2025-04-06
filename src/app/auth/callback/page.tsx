'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Check if there was an error in the callback
        const error = searchParams.get('error');
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        // Process the authentication
        await refreshSession();
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect after successful auth
        const redirectTo = searchParams.get('redirect') || '/app/dashboard';
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
      }
    }

    handleCallback();
  }, [router, searchParams, refreshSession]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          {status === 'loading' && 'Processing Login'}
          {status === 'success' && 'Login Successful'}
          {status === 'error' && 'Login Failed'}
        </h1>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {status === 'loading' && (
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          )}
          
          <p className="text-center text-muted-foreground">
            {message}
          </p>
          
          {status === 'error' && (
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 