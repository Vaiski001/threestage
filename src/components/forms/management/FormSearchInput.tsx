
import { Input } from "@/components/ui/input";

interface FormSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FormSearchInput({ searchQuery, setSearchQuery }: FormSearchInputProps) {
  return (
    <div className="flex">
      <Input
        placeholder="Search forms..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-lg"
      />
    </div>
  );
}
