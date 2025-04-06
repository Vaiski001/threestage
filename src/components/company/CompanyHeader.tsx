import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReactNode } from "react";

interface CompanyHeaderProps {
  onNewForm?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  rightActions?: ReactNode;
  showSearchBar?: boolean;
}

export const CompanyHeader = ({ 
  onNewForm, 
  searchPlaceholder = "Search enquiries, forms, customers...",
  onSearch,
  searchValue = "",
  rightActions,
  showSearchBar = true
}: CompanyHeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {showSearchBar && (
          <div className="relative flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pl-9 h-9 text-sm rounded-md"
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {rightActions ? (
          rightActions
        ) : (
          <>
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
            </div>
            
            <Button
              variant="default" 
              size="sm" 
              onClick={onNewForm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Form
            </Button>
            
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarFallback className="bg-indigo-100 text-indigo-700">CO</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </header>
  );
}; 