
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  category: "featured" | "premium" | "newest";
  lastInteracted?: string;
}

export function CompanyDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "featured" | "premium" | "newest">("all");
  
  // Empty state for a new account
  const companies: Company[] = [];
  const recentCompanies: Company[] = [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-bold">Find Company</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/companies" className="flex items-center text-xs">
            Go to Company Directory
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search companies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("all")}
            className="text-xs h-7"
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "featured" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("featured")}
            className="text-xs h-7"
          >
            Featured
          </Button>
          <Button 
            variant={activeFilter === "premium" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("premium")}
            className="text-xs h-7"
          >
            Premium
          </Button>
          <Button 
            variant={activeFilter === "newest" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("newest")}
            className="text-xs h-7"
          >
            Newest
          </Button>
        </div>

        {companies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {companies.slice(0, 4).map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <Building className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No companies found</p>
            <Button asChild className="mt-3" size="sm">
              <Link to="/companies">Discover Companies</Link>
            </Button>
          </div>
        )}

        {recentCompanies.length > 0 && (
          <>
            <h3 className="text-sm font-medium pt-2">Recent companies you interacted with</h3>
            <div className="space-y-2">
              {recentCompanies.map(company => (
                <RecentCompanyRow key={company.id} company={company} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link to={`/companies/${company.id}`} className="block">
      <div className="border rounded-lg p-3 hover:border-primary/50 hover:shadow-sm transition-all">
        <div className="flex items-center gap-3">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{company.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{company.industry}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function RecentCompanyRow({ company }: { company: Company }) {
  return (
    <Link to={`/companies/${company.id}`} className="block">
      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
        <div className="flex items-center gap-2">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name} 
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-3 w-3 text-primary" />
            </div>
          )}
          <span className="text-sm">{company.name}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {company.lastInteracted}
        </Badge>
      </div>
    </Link>
  );
}
