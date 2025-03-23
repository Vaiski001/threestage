
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { UserRole } from "@/lib/supabase/types";

interface EmailVerificationMessageProps {
  role: UserRole;
  email?: string;
}

export function EmailVerificationMessage({ role, email }: EmailVerificationMessageProps) {
  const accountType = role === 'company' ? 'company' : 'customer';
  const dashboardPath = role === 'company' ? '/company/dashboard' : '/customer/dashboard';
  
  return (
    <Alert className="my-4">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <AlertTitle>Email Verification Sent</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          We've sent a verification email to {email ? <strong>{email}</strong> : 'your email address'}.
          Please check your inbox and click the verification link to complete your {accountType} account setup.
        </p>
        <p className="mt-2">
          After verification, you'll be automatically redirected to your {accountType} dashboard.
          If you don't receive the email within a few minutes, please check your spam folder.
        </p>
      </AlertDescription>
    </Alert>
  );
}
