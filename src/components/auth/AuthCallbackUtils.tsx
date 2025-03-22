
import React from 'react';
import { User } from '@supabase/supabase-js';
import { RefreshCw, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DebugInfoProps {
  authStage: string;
  userRole: string;
  needsAdditionalInfo: boolean;
  currentUser: User | null;
  redirectUrl: string;
  processingTimeElapsed: number;
}

export const DebugInfo = ({ 
  authStage, 
  userRole, 
  needsAdditionalInfo, 
  currentUser, 
  redirectUrl, 
  processingTimeElapsed 
}: DebugInfoProps) => (
  <div className="mt-4 p-4 bg-slate-100 rounded-md text-xs text-slate-700">
    <p><strong>Auth Stage:</strong> {authStage}</p>
    <p><strong>Role:</strong> {userRole}</p>
    <p><strong>Needs Additional Info:</strong> {needsAdditionalInfo ? 'Yes' : 'No'}</p>
    <p><strong>Has URL Hash:</strong> {window.location.hash ? 'Yes' : 'No'}</p>
    <p><strong>User ID:</strong> {currentUser?.id || 'None'}</p>
    <p><strong>Current URL:</strong> {redirectUrl}</p>
    <p><strong>Expected Callback URL:</strong> {window.location.origin}/auth/callback</p>
    <p><strong>Processing Time:</strong> {processingTimeElapsed} seconds</p>
    <p><strong>localStorage:</strong></p>
    <pre className="mt-1 p-2 bg-slate-200 rounded text-xs overflow-x-auto">
      {JSON.stringify(
        Object.keys(localStorage).reduce((acc, key) => {
          if (key.startsWith('supabase.') || key.startsWith('sb-') || key.startsWith('oauth_')) {
            acc[key] = localStorage.getItem(key);
          }
          return acc;
        }, {} as Record<string, string | null>),
        null,
        2
      )}
    </pre>
  </div>
);

interface AuthLoadingProps {
  processingTimeElapsed: number;
  manualRedirect: boolean;
  showDebugInfo: boolean;
  setShowDebugInfo: (value: boolean) => void;
  authStage: string;
  handleReset: () => void;
  parseHashAndRedirect: () => void;
  debugInfo: React.ReactNode;
}

export const AuthLoading = ({
  processingTimeElapsed,
  manualRedirect,
  showDebugInfo,
  setShowDebugInfo,
  authStage,
  handleReset,
  parseHashAndRedirect,
  debugInfo
}: AuthLoadingProps) => (
  <>
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
    <p className="text-muted-foreground mb-2">Please wait while we log you in.</p>
    <p className="text-sm text-muted-foreground">Auth stage: {authStage}</p>
    
    {processingTimeElapsed > 8 && !manualRedirect && (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Taking longer than expected</AlertTitle>
        <AlertDescription>
          Authentication is taking longer than usual. 
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            {showDebugInfo ? "Hide Details" : "Show Details"}
          </Button>
        </AlertDescription>
      </Alert>
    )}
    
    {processingTimeElapsed > 12 && !manualRedirect && (
      <div className="mt-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          onClick={handleReset}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset & Try Again
        </Button>
        
        <Button
          variant="outline"
          onClick={parseHashAndRedirect}
          className="flex items-center"
        >
          Try Manual Login
        </Button>
      </div>
    )}
    
    {showDebugInfo && debugInfo}
  </>
);

interface AuthErrorProps {
  errorMessage: string;
  handleReset: () => void;
  handleDeleteAccount: () => void;
  navigateToLogin: () => void;
  parseHashAndRedirect: () => void;
  debugInfo: React.ReactNode;
  showDebugInfo: boolean;
}

export const AuthError = ({
  errorMessage,
  handleReset,
  handleDeleteAccount,
  navigateToLogin,
  parseHashAndRedirect,
  debugInfo,
  showDebugInfo
}: AuthErrorProps) => (
  <>
    <div className="w-16 h-16 mx-auto mb-4 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h2 className="text-xl font-semibold mb-2 text-destructive">Authentication Failed</h2>
    <p className="text-muted-foreground mb-4">{errorMessage}</p>
    <div className="flex flex-col gap-2">
      <Button 
        variant="default" 
        className="w-full"
        onClick={handleReset}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset & Try Again
      </Button>
      
      <Button 
        variant="destructive" 
        className="w-full"
        onClick={handleDeleteAccount}
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete Account & Try Again
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={navigateToLogin}
      >
        Return to Login
      </Button>
      
      {window.location.hash && window.location.hash.includes('access_token') && (
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={parseHashAndRedirect}
        >
          Try Manual Login
        </Button>
      )}
    </div>
    {showDebugInfo && debugInfo}
  </>
);

export const AuthSuccess = ({ debugInfo, showDebugInfo }: { debugInfo: React.ReactNode, showDebugInfo: boolean }) => (
  <>
    <div className="w-16 h-16 mx-auto mb-4 text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-xl font-semibold mb-2 text-primary">Authentication Successful</h2>
    <p className="text-muted-foreground mb-4">You've been successfully authenticated.</p>
    <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
    {showDebugInfo && debugInfo}
  </>
);
