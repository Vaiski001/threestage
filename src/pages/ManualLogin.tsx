import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserProfile, deleteUserAccount } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw, Trash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ManualLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Initializing...');

  useEffect(() => {
    const processManualLogin = async () => {
      try {
        setProgressMessage('Starting manual login process');
        setProgress(10);
        console.log("Manual login process started");
        
        // Get token data from localStorage
        const tokenDataStr = localStorage.getItem('supabase_manual_token');
        if (!tokenDataStr) {
          throw new Error("No token data found");
        }
        
        const tokenData = JSON.parse(tokenDataStr);
        setProgressMessage('Found token data');
        setProgress(20);
        console.log("Found token data");
        
        // Check if token is fresh (less than 5 minutes old - increased from 2)
        const timestamp = tokenData.timestamp || 0;
        const now = Date.now();
        if (now - timestamp > 300000) { // 5 minutes
          throw new Error("Token data is too old, please try again");
        }
        
        // Reset auth state before setting new session
        setProgressMessage('Clearing previous auth state');
        setProgress(30);
        await supabase.auth.signOut({ scope: 'local' });
        
        // Wait a moment for auth state to reset
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(40);
        
        // Split the token setting process into smaller steps
        setProgressMessage('Preparing to set session');
        setProgress(50);
        
        // Instead of creating a new client instance, we'll use the existing one
        // with a clean slate after sign out
        setProgressMessage('Setting session token');
        setProgress(60);
        
        // Set the session with a shorter timeout
        let sessionResult;
        try {
          sessionResult = await Promise.race([
            supabase.auth.setSession({
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token || '',
            }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Session setup timed out after 5 seconds")), 5000)
            )
          ]);
        } catch (error: any) {
          console.error("Session setup timed out:", error);
          
          // If this is not the first attempt, try again with a different approach
          if (attempts < 3) {
            setAttempts(prev => prev + 1);
            setProgressMessage(`Retrying manual login (attempt ${attempts + 1})`);
            console.log(`Retrying manual login (attempt ${attempts + 1})`);
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 800));
            processManualLogin();
            return;
          } else {
            throw new Error("Failed to set up session after multiple attempts. Please try logging in again.");
          }
        }
        
        if (sessionResult.error) throw sessionResult.error;
        if (!sessionResult.data.session) throw new Error("No session returned");
        
        setProgressMessage('Session set successfully');
        setProgress(70);
        console.log("Session set successfully:", sessionResult.data.session.user.id);
        
        // Store the user ID for potential account deletion
        setUserId(sessionResult.data.session.user.id);
        
        // Get user profile
        setProgressMessage('Fetching user profile');
        setProgress(90);
        const profile = await getUserProfile(sessionResult.data.session.user.id);
        
        // Clear temporary token data
        localStorage.removeItem('supabase_manual_token');
        
        setProgressMessage('Login complete');
        setProgress(100);
        setSuccess(true);
        
        // Redirect based on role
        setTimeout(() => {
          if (profile?.role === 'company') {
            navigate('/dashboard');
          } else {
            navigate('/enquiries');
          }
        }, 1000);
        
      } catch (error: any) {
        console.error("Manual login failed:", error);
        setError(error.message || "Authentication failed");
        setIsProcessing(false);
      }
    };
    
    processManualLogin();
  }, [navigate, toast, attempts]);
  
  const handleDeleteAccount = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Could not determine user account to delete",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await deleteUserAccount(userId);
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted. You can now sign up again.",
      });
      navigate('/login');
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Manual Authentication</CardTitle>
          <CardDescription>Processing your authentication data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {isProcessing && !success && !error && (
            <>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-center">{progressMessage}</p>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Attempt {attempts + 1}{attempts > 0 ? ` (previous attempts failed)` : ''}
              </p>
            </>
          )}
          
          {success && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-center">Authentication successful! Redirecting you now...</p>
              <Progress value={100} className="w-full" />
            </>
          )}
          
          {error && (
            <>
              <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-center text-destructive">{error}</p>
            </>
          )}
        </CardContent>
        {error && (
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Return to Login
            </Button>
            
            {userId && (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteAccount}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Account & Try Again
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
