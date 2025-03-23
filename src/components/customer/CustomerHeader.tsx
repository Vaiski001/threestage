
import { Button } from "@/components/ui/button";
import { Bell, Plus, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CustomerHeaderProps {
  onNewEnquiry: () => void;
}

export const CustomerHeader = ({ onNewEnquiry }: CustomerHeaderProps) => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative hidden sm:block">
          <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search enquiries..."
            className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
        </Button>
        <Button variant="default" size="sm" onClick={onNewEnquiry}>
          New Enquiry
        </Button>
      </div>
    </header>
  );
};
