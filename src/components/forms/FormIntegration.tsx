
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ArrowLeft, Check, Code, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FormTemplate } from "@/lib/supabase/types";

interface FormIntegrationProps {
  form: FormTemplate;
  onClose: () => void;
}

export function FormIntegration({ form, onClose }: FormIntegrationProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Get the base URL for our app
  const baseUrl = window.location.origin;
  const formUrl = `${baseUrl}/forms/${form.id}`;

  // Generate embed code (Script method)
  const generateEmbedCode = () => {
    return `<!-- ${form.name} Embed Code -->
<div id="enquiry-form-${form.id}"></div>
<script src="${baseUrl}/api/embed-form.js?id=${form.id}" async></script>`;
  };

  // Generate iframe code
  const generateIframeCode = () => {
    return `<iframe
  src="${formUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; max-width: 100%;"
  title="${form.name}"
></iframe>`;
  };

  // Copy code to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: `${type} code has been copied.`
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-xl font-bold">Form Integration</h2>
        <div></div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Integration options for "{form.name}"</h3>
        
        <Tabs defaultValue="embed">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="embed">
              <Code className="mr-2 h-4 w-4" />
              Embed Code
            </TabsTrigger>
            <TabsTrigger value="iframe">
              <ExternalLink className="mr-2 h-4 w-4" />
              iFrame
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="embed" className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Add this code to your website to embed the form directly into your page. The form will
              inherit styles from your website and appear native to your design.
            </p>
            
            <div className="relative">
              <Textarea
                value={generateEmbedCode()}
                readOnly
                className="font-mono text-sm bg-muted h-32"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateEmbedCode(), "Embed")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="iframe" className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Use an iframe to embed your form. This is simpler to implement but provides less
              flexibility for styling integration with your website.
            </p>
            
            <div className="relative">
              <Textarea
                value={generateIframeCode()}
                readOnly
                className="font-mono text-sm bg-muted h-32"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateIframeCode(), "iFrame")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-4 border-t">
          <h4 className="font-medium mb-2">Direct Link</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Share this link directly to let people fill out your form outside your website.
          </p>
          
          <div className="flex gap-2">
            <Input
              value={formUrl}
              readOnly
              className="font-mono text-sm flex-1"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(formUrl, "Direct link")}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <h4 className="font-medium mb-2">Connect to Your Services</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Link this form to specific services you offer to manage related enquiries.
        </p>
        
        <Button 
          onClick={() => {
            toast({
              title: "Linking Services",
              description: "This feature will be available in a future update."
            });
          }}
        >
          Link to Services
        </Button>
      </div>
    </div>
  );
}
