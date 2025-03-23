
import { useState } from "react";
import { FormLabel } from "@/components/ui/form-label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/lib/supabase/types";

interface InquiryFormTabProps {
  profile: UserProfile | null;
  onUpdate: (values: any) => void;
}

export function InquiryFormTab({ profile, onUpdate }: InquiryFormTabProps) {
  const { toast } = useToast();
  const [formEnabled, setFormEnabled] = useState(profile?.inquiry_form_enabled || false);
  const [embedCode, setEmbedCode] = useState<string>("");

  const handleCopyEmbedCode = () => {
    // Generate embed code for the form
    const code = `<iframe src="https://yourapp.com/form/${profile?.id}" width="100%" height="500" frameborder="0"></iframe>`;
    setEmbedCode(code);
    
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Embed code copied!",
        description: "Paste this code into your website to embed the inquiry form.",
      });
    });
  };

  const handleFormToggle = (checked: boolean) => {
    setFormEnabled(checked);
    onUpdate({ inquiry_form_enabled: checked });
    
    toast({
      title: checked ? "Inquiry form enabled" : "Inquiry form disabled",
      description: checked 
        ? "Customers can now submit inquiries through your profile" 
        : "Inquiry form has been disabled on your profile",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Inquiry Form</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Enable Inquiry Form</h3>
          <p className="text-gray-600">Allow customers to submit inquiries through your profile</p>
        </div>
        <Switch 
          checked={formEnabled} 
          onCheckedChange={handleFormToggle}
        />
      </div>
      
      {formEnabled && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Embed on Your Website</h3>
            <p className="text-gray-600 mb-3">
              You can embed this inquiry form on your website by copying the code below:
            </p>
            
            <div className="bg-gray-100 p-3 rounded-md mb-3 font-mono text-sm overflow-x-auto">
              {embedCode || '<iframe src="https://yourapp.com/form/[your-id]" width="100%" height="500" frameborder="0"></iframe>'}
            </div>
            
            <Button onClick={handleCopyEmbedCode} variant="outline">
              Copy Embed Code
            </Button>
          </div>
          
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
            <h4 className="font-medium text-blue-700">Looking for more customization?</h4>
            <p className="text-blue-600 mt-1">
              You can create a custom form in the Form Builder section of your dashboard.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
