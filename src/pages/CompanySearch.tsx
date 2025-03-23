
import React, { useState } from 'react';
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CompanyCard } from '@/components/company/CompanyCard';
import { UserProfile } from '@/lib/supabase/types';
import { Header } from '@/components/layout/Header';
import { Search, Filter } from 'lucide-react';

// Mock data for companies
const mockCompanies: UserProfile[] = [
  {
    id: '1',
    email: 'info@acmecorp.com',
    name: 'John Smith',
    role: 'company',
    company_name: 'Acme Corporation',
    industry: 'Technology',
    website: 'acmecorp.com',
    address: '123 Tech Lane, Silicon Valley, CA',
    phone: '(555) 123-4567',
    services: 'Web Development,Mobile Apps,Cloud Solutions',
    created_at: '2023-01-15',
  },
  {
    id: '2',
    email: 'contact@greenleaf.com',
    name: 'Sarah Johnson',
    role: 'company',
    company_name: 'Green Leaf Landscaping',
    industry: 'Home & Garden',
    website: 'greenleaf.com',
    address: '456 Garden Road, Portland, OR',
    phone: '(555) 987-6543',
    services: 'Landscape Design,Garden Maintenance,Hardscaping',
    created_at: '2023-02-20',
  },
  {
    id: '3',
    email: 'hello@blueocean.com',
    name: 'Michael Chen',
    role: 'company',
    company_name: 'Blue Ocean Consulting',
    industry: 'Business Services',
    website: 'blueocean.com',
    address: '789 Consultant Ave, Chicago, IL',
    phone: '(555) 456-7890',
    services: 'Business Strategy,Market Analysis,Growth Planning',
    created_at: '2023-03-10',
  },
];

export function CompanySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Get unique industries for filter dropdown
  const industries = Array.from(new Set(mockCompanies.map(company => company.industry))).filter(Boolean) as string[];
  
  // Filter companies based on search term and industry
  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      (company.company_name && typeof company.company_name === 'string' && company.company_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (company.services && typeof company.services === 'string' && company.services.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-6">Find Companies</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search by company name or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center mb-4">
          <Filter className="mr-2 text-gray-500" size={18} />
          <span className="text-gray-600">
            {filteredCompanies.length} companies found
          </span>
        </div>
        
        <Separator className="my-4" />
        
        {/* Results Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No companies found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Container>
    </div>
  );
}

// Add default export for the component
export default CompanySearch;
