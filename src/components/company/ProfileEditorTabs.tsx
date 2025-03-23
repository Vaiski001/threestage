
import { useState } from "react";
import { Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileEditorTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function ProfileEditorTabs({ activeTab, onChange }: ProfileEditorTabsProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "branding", label: "Branding & Info" },
    { id: "contact", label: "Contact" },
    { id: "services", label: "Services" },
  ];

  const handlePreview = () => {
    toast({
      title: "Preview mode",
      description: "Opening company profile preview...",
    });
    // Handle preview functionality
  };

  const handleSaveAndPublish = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile published!",
        description: "Your company profile has been updated and published.",
      });
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Profile Editor</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSaveAndPublish} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save & Publish
          </Button>
        </div>
      </div>

      <div className="flex w-full mb-8 rounded-lg overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === tab.id
                ? "bg-white text-foreground font-medium"
                : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
