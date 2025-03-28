
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form-label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormTemplate } from "@/lib/supabase/types";

interface BrandingTabContentProps {
  formData: FormTemplate;
  updateBranding: (field: keyof FormTemplate['branding'], value: string) => void;
}

export function BrandingTabContent({ formData, updateBranding }: BrandingTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Styling & Branding</CardTitle>
        <CardDescription>Customize the appearance of your form</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <FormLabel htmlFor="primary-color">Primary Color</FormLabel>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="primary-color"
              type="color"
              value={formData.branding.primaryColor || '#0070f3'}
              onChange={(e) => updateBranding('primaryColor', e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              value={formData.branding.primaryColor || '#0070f3'}
              onChange={(e) => updateBranding('primaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <FormLabel htmlFor="font-family">Font Family</FormLabel>
          <select
            id="font-family"
            value={formData.branding.fontFamily || 'Inter'}
            onChange={(e) => updateBranding('fontFamily', e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Roboto">Roboto</option>
          </select>
        </div>

        <div>
          <FormLabel htmlFor="form-logo">Logo URL (optional)</FormLabel>
          <Input
            id="form-logo"
            value={formData.branding.logo || ''}
            onChange={(e) => updateBranding('logo', e.target.value)}
            placeholder="https://example.com/logo.png"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Enter the URL of your company logo</p>
        </div>
        
        <div className="pt-4">
          <p className="text-sm font-medium mb-2">Preview (Sample Field):</p>
          <div 
            className="border rounded-md p-6 shadow-sm" 
            style={{
              fontFamily: formData.branding.fontFamily || 'Inter',
              "--primary-color": formData.branding.primaryColor || '#0070f3'
            } as React.CSSProperties}
          >
            {formData.branding.logo && (
              <div className="mb-6">
                <img 
                  src={formData.branding.logo} 
                  alt="Form Logo" 
                  className="max-h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Sample Text Input</label>
                <input 
                  type="text" 
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Sample placeholder text"
                  style={{
                    borderColor: formData.branding.primaryColor || '#0070f3',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sample Dropdown</label>
                <select 
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  style={{
                    borderColor: formData.branding.primaryColor || '#0070f3',
                    outline: 'none'
                  }}
                >
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              <button 
                className="px-4 py-2 rounded-md text-white"
                style={{
                  backgroundColor: formData.branding.primaryColor || '#0070f3'
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
