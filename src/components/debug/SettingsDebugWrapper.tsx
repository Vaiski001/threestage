import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { BugIcon } from "lucide-react";
import { ProfileDebugger } from "./ProfileDebugger";

interface SettingsDebugWrapperProps {
  children: ReactNode;
}

/**
 * This wrapper component adds a debug panel toggle to any page
 * without modifying the existing components.
 * 
 * Usage:
 * <SettingsDebugWrapper>
 *   <YourExistingSettingsComponent />
 * </SettingsDebugWrapper>
 */
export function SettingsDebugWrapper({ children }: SettingsDebugWrapperProps) {
  const [showDebugger, setShowDebugger] = useState(false);
  
  return (
    <div className="relative">
      {/* Debug toggle button - position in bottom right corner */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white shadow-md"
        onClick={() => setShowDebugger(!showDebugger)}
      >
        <BugIcon className="h-4 w-4" />
        {showDebugger ? "Hide Debugger" : "Show Debugger"}
      </Button>
      
      {/* Original content */}
      {children}
      
      {/* Debug panel only shown when toggled */}
      {showDebugger && (
        <div className="mt-8 border-t pt-8">
          <ProfileDebugger />
        </div>
      )}
    </div>
  );
} 