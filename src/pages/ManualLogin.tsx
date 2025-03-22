
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserProfile } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function ManualLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processManualLogin = async () => {
      try {
        console.log("Manual login process started");
        
        // Get token data from localStorage
        const tokenDataStr = localStorage.getItem('supabase_manual_token');
        if (!tokenDataStr) {
          throw new Error("No token data found");
        }
        
        const tokenData = JSON.parse(tokenDataStr);
        console.log("Found token data");
        
        // Check if token is fresh (less than 1 minute old)
        const timestamp = tokenData.timestamp || 0;
        const now = Date.now();
        if (now - timestamp > 60000) {
          throw new Error("Token data is too old, please try again");
        }
        
        // Set the session manually
        const { data, error } = await supabase.auth.setSession({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || '',
        });
        
        if (error) throw error;
        if (!data.session) throw new Error("No session returned");
        
        console.log("Session set successfully:", data.session.user.id);
        
        // Get user profile
        const profile = await getUserProfile(data.session.user.id);
        
        // Clear temporary token data
        localStorage.removeItem('supabase_manual_token');
        
        setSuccess(true);
        
        // Redirect based on role
        setTimeout(() => {
          if (profile?.role === 'company') {
            navigate('/dashboard');
          } else {
            navigate('/enquiries');
          }
        }, 1500);
        
      } catch (error: any) {
        console.error("Manual login failed:", error);
        setError(error.message || "Authentication failed");
        setIsProcessing(false);
      }
    };
    
    processManualLogin();
  }, [navigate, toast]);
  
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Manual Authentication</CardTitle>
          <CardDescription>Processing your authentication data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isProcessing && !success && !error && (
            <>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Setting up your session...</p>
            </>
          )}
          
          {success && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-center">Authentication successful! Redirecting you now...</p>
            </>
          )}
          
          {error && (
            <>
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
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
