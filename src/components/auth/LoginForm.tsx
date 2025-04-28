import * as React from "react";
import { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isSupabaseAvailable, getServiceStatus } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [serviceCheckCount, setServiceCheckCount] = useState(0);
  const [serviceStatus, setServiceStatus] = useState<'available' | 'degraded' | 'unavailable'>('available');
  
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginTimeout, setLoginTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [captchaDetected, setCaptchaDetected] = useState(false);

  const checkSupabaseAvailability = useCallback(async () => {
    let isMounted = true;
    setIsCheckingConnection(true);
    
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Availability check timed out, allowing form interaction");
        setIsCheckingConnection(false);
      }
    }, 3000);
    
    try {
      const isAvailable = await isSupabaseAvailable();
      const statusResult = await getServiceStatus();
      setServiceStatus(statusResult.status);
      
      if (!isAvailable) {
        const errorMsg = "Supabase services may be experiencing issues. Some features might not work correctly.";
        setSupabaseError(errorMsg);
        if (onError) onError(errorMsg);
      } else {
        setSupabaseError(null);
      }
    } catch (error) {
      console.error("Error checking Supabase availability:", error);
      const errorMsg = "Unable to verify connection to authentication services.";
      setSupabaseError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      clearTimeout(timeoutId);
      setIsCheckingConnection(false);
      setServiceCheckCount(prev => prev + 1);
    }
    
    return () => {
      isMounted = false;
    };
  }, [onError]);

  useEffect(() => {
    const checkHandler = checkSupabaseAvailability();
    
    const interval = serviceStatus !== 'available' 
      ? setInterval(() => checkSupabaseAvailability(), 15000) 
      : null;
    
    return () => {
      if (interval) clearInterval(interval);
      checkHandler;
    };
  }, [checkSupabaseAvailability, serviceStatus]);

  useEffect(() => {
    return () => {
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, [loginTimeout]);

  const validateForm = () => {
    try {
      loginSchema.parse({ email: emailValue, password: passwordValue });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      // Validate inputs before submitting
      const validationResult = loginSchema.safeParse({ email: emailValue, password: passwordValue });
      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            formattedErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(formattedErrors);
        setIsLoading(false);
        return;
      }
      
      // Clear any previous login timeouts
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }
      
      console.log("Starting login process for:", emailValue);
      
      // Clear storage completely before login to prevent conflicts
      console.log("Clearing all authentication data from storage");
      
      // Clear all auth-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || 
            key.includes('user') || 
            key.includes('role') || 
            key.includes('profile_')) {
          console.log(`Removing localStorage item: ${key}`);
          localStorage.removeItem(key);
        }
      });
      
      // Clear all auth-related items from sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || 
            key.includes('user') || 
            key.includes('role') || 
            key.includes('profile_')) {
          console.log(`Removing sessionStorage item: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
      
      // Force clear specific known items to ensure they're gone
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.user_role');
      localStorage.removeItem('userRole');
      sessionStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('userRole');
      
      console.log("Storage cleared, proceeding with login attempt");
      
      // Setup timeout to prevent hanging on login (increased to 20 seconds)
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setErrorMessage(
          "Login request timed out. The authentication service might be temporarily unavailable. " +
          "Please try again or use Google login instead."
        );
        
        // Automatically check service status when timeout occurs
        checkSupabaseAvailability();
        
        // Show toast with more details
        toast({
          title: "Connection issue detected",
          description: "We're having trouble connecting to our authentication service. You might want to try Google login as an alternative.",
          duration: 8000,
        });
      }, 20000);
      setLoginTimeout(timeout);
      
      // Increment login attempt counter
      setLoginAttempts(prev => prev + 1);
      
      // Attempt login
      const loginResult = await signInWithEmail(emailValue, passwordValue);
      
      // Clear timeout as we received a response
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }
      
      // Check for errors
      if (loginResult.error) {
        console.error("Login error:", loginResult.error);
        
        // Handle specific error cases with improved user feedback
        const errorMessage = loginResult.error.message as string || '';
        
        if (errorMessage.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please check your credentials and try again.");
        } else if (errorMessage.includes("rate limit")) {
          setErrorMessage("Too many login attempts. Please try again later or use Google login instead.");
          setCaptchaDetected(true);
        } else if (errorMessage.includes("captcha")) {
          setErrorMessage("Security verification required. Please try again in a moment or use Google login instead.");
          setCaptchaDetected(true);
        } else if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
          setErrorMessage(
            "Request timed out. Please check your internet connection and try again, " +
            "or use Google login as an alternative."
          );
          // Check service status after timeout
          await checkSupabaseAvailability();
        } else {
          // Use the detailed error message if available
          setErrorMessage(
            (loginResult.error as any).details || 
            errorMessage || 
            "An error occurred during login. Please try again or use Google login."
          );
        }
        
        // Track failed login
        setLoginAttempts(prev => prev + 1);
        
        // If multiple failures, suggest password reset or Google login
        if (loginAttempts >= 2) {
          toast({
            title: "Having trouble logging in?",
            description: "You can reset your password or try logging in with Google instead.",
            duration: 8000,
          });
        }
        
        setIsLoading(false);
        return;
      }
      
      // If we got here, the login was successful
      console.log("Login successful");
      setErrorMessage(null);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to dashboard with slight delay to allow auth context to update
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000); // Increased from 500 to 1000ms
    } catch (err: any) {
      console.error("Exception during login:", err);
      
      // Clear any timeouts
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }
      
      setErrorMessage(
        err.details || 
        err.message || 
        "An unexpected error occurred. Please try again or use Google login."
      );
      
      // If there seem to be connection issues, check Supabase availability
      setTimeout(async () => {
        try {
          await checkSupabaseAvailability();
          const statusResult = await getServiceStatus();
          const status = statusResult.status || 'unavailable';
          setServiceStatus(status);
          
          if (status !== 'available') {
            toast({
              title: "Service Status",
              description: `Our authentication service is currently ${status}. This may affect your login. Using Google login is recommended.`,
              duration: 8000,
            });
          }
        } catch (e) {
          console.error("Error checking service status:", e);
        }
      }, 500);
      
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google login error:", error);
      
      let errorMsg = "Failed to initiate Google login. Please try again.";
      if (error.message?.includes("unavailable") || error.message?.includes("maintenance")) {
        errorMsg = "Authentication services are currently unavailable. Please try again later.";
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast({
        title: "Google login failed",
        description: errorMsg,
        variant: "destructive",
      });
      
      setErrorMessage(errorMsg);
      
      if (onError) {
        onError(errorMsg);
      }
      setIsGoogleLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  return (
    <div className="space-y-6">
      {serviceStatus === 'unavailable' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Authentication services appear to be down. Please try again later or use Google login.
          </AlertDescription>
        </Alert>
      )}
      
      {serviceStatus === 'degraded' && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Supabase services may be experiencing issues. Login might be unreliable.
            We recommend using Google login for more reliable authentication.
          </AlertDescription>
        </Alert>
      )}
      
      {supabaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{supabaseError}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && !supabaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={emailValue}
            onChange={handleEmailChange}
            disabled={isLoading}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm font-medium text-destructive">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={passwordValue}
              onChange={handlePasswordChange}
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm font-medium text-destructive">{errors.password}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || serviceStatus === 'unavailable'}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : isCheckingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking Services...
            </>
          ) : (
            "Log in"
          )}
        </Button>
        
        <div className="flex justify-between items-center">
          <Button variant="link" className="px-0 text-sm" onClick={() => navigate("/reset-password")}>
            Forgot password?
          </Button>
          <Button variant="link" className="px-0 text-sm" onClick={() => navigate("/signup")}>
            Need an account?
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading}
        className="w-full"
        onClick={handleGoogleLogin}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
        )}
        Continue with Google
      </Button>
      
      {(captchaDetected || serviceStatus !== 'available') && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <p><strong>Recommended:</strong> Use Google login instead of password login for more reliable authentication during this time.</p>
          </AlertDescription>
        </Alert>
      )}
      
      {captchaDetected && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <p>CAPTCHA verification is preventing direct login. Please try:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Using Google login instead (recommended)</li>
              <li>Waiting 15-30 minutes before trying again</li>
              <li>Clearing your browser cookies and cache</li>
              <li>Using a different network connection</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
