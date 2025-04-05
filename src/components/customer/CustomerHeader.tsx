import { Button } from "@/components/ui/button";
import { Bell, Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface CustomerHeaderProps {
  onNewEnquiry?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  rightActions?: ReactNode;
  showSearchBar?: boolean;
}

export const CustomerHeader = ({ 
  onNewEnquiry, 
  searchPlaceholder = "Search...",
  onSearch,
  searchValue = "",
  rightActions,
  showSearchBar = true
}: CustomerHeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {showSearchBar && (
          <div className="relative flex items-center">
            <div className="relative">
              <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="w-64 pl-10 pr-4 py-2 text-sm rounded-md border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </Button>
            <Button
              variant="default" 
              size="sm" 
              onClick={onNewEnquiry}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Enquiry
            </Button>
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src="/avatar-placeholder.png" alt="User" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700">UN</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </header>
  );
};
