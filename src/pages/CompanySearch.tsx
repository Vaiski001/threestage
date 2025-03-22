import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase/types";
import { Search, Building, MapPin, Link as LinkIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTemplate } from "@/components/forms/FormManagement";

const CompanySearchHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  onSearch 
}: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}) => {
  return (
    <div className="py-10 bg-muted/50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Find a Company</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Search for companies by name or industry and submit your enquiries directly through our platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company name or industry..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>
          <Button onClick={onSearch}>Search</Button>
        </div>
      </div>
    </div>
  );
};

const CompanyCard = ({ company }: { company: UserProfile }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{company.company_name || "Unnamed Company"}</CardTitle>
        <CardDescription>
          {company.industry ? (
            <div className="flex items-center gap-1 mt-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{company.industry}</span>
            </div>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {company.website && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-blue-500">
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/companies/${company.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Company
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const CompanyCardSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const CompanySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 9;

  const performSearch = () => {
    refetch();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['companies', searchQuery, currentPage, activeTab],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'company')
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchQuery) {
        query = query.or(`company_name.ilike.%${searchQuery}%,industry.ilike.%${searchQuery}%`);
      }

      if (activeTab !== 'all') {
        query = query.eq('industry', activeTab);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }

      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'company');

      if (countError) {
        console.error("Error counting companies:", countError);
      }

      return {
        companies: data as UserProfile[],
        totalCount: count || 0
      };
    }
  });

  const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 0;

  const { data: industriesData } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('industry')
        .eq('role', 'company')
        .not('industry', 'is', null);

      if (error) {
        console.error("Error fetching industries:", error);
        throw error;
      }

      const industries = [...new Set(data
        .map(item => item.industry)
        .filter((industry): industry is string => typeof industry === 'string')
      )];

      return industries;
    }
  });

  return (
    <div className="min-h-screen pb-16">
      <CompanySearchHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onSearch={performSearch}
      />
      
      <div className="container mx-auto px-4 mt-8">
        {industriesData && industriesData.length > 0 && (
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
            className="mb-8"
          >
            <TabsList className="mb-4 flex flex-wrap h-auto">
              <TabsTrigger value="all">All Industries</TabsTrigger>
              {industriesData.map((industry, index) => (
                <TabsTrigger key={index} value={industry}>
                  {industry}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <CompanyCardSkeleton key={index} />
            ))
          ) : data && data.companies.length > 0 ? (
            data.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageToShow = 
                  totalPages <= 5 ? i + 1 :
                  currentPage <= 3 ? i + 1 :
                  currentPage >= totalPages - 2 ? totalPages - 4 + i :
                  currentPage - 2 + i;
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === pageToShow}
                      onClick={() => setCurrentPage(pageToShow)}
                    >
                      {pageToShow}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default CompanySearch;
