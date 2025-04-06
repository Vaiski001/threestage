import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Component imports
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { EnquiryCard } from "@/components/kanban/EnquiryCard";
import { FormManagement } from "@/components/forms/FormManagement";

// Hook imports
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Icon imports
import { 
  Filter, 
  Plus, 
  Search, 
  Bell, 
  PlusCircle, 
  BarChart2, 
  ArrowUpRight, 
  FormInput 
} from "lucide-react";

/**
 * CompanyDashboard - Main dashboard page for company users
 * Displays key statistics, enquiry board, forms, and analytics
 */
export default function CompanyDashboard() {
  // State management
  const { profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [localProfile, setLocalProfile] = useState(profile);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync local profile with auth context
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  // Regularly refresh profile data
  useEffect(() => {
    refreshProfile();
    
    const intervalId = setInterval(() => {
      refreshProfile();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshProfile]);

  // Sample stats data
  const stats = [
    { label: "Total Enquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Pending", value: "0", change: "0%", changeType: "neutral" },
    { label: "Response Time", value: "0h", change: "0h", changeType: "neutral" },
    { label: "Conversion Rate", value: "0%", change: "0%", changeType: "neutral" }
  ];

  // Sample analytics data
  const analyticsData = {
    enquiries: [],
    conversion: [],
    response: [],
    revenue: []
  };

  // Event handlers
  const handleCreateForm = () => {
    setActiveTab("forms");
    toast({
      title: "Create New Form",
      description: "Now you can create a new form."
    });
  };

  const handleNewEnquiry = () => {
    toast({
      title: "Feature coming soon", 
      description: "New enquiry creation is coming soon."
    });
  };

  const handleCreateEnquiry = () => {
    toast({
      title: "Create Enquiry",
      description: "This feature is coming soon."
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      pageTitle="Company Dashboard"
      searchPlaceholder="Search enquiries, forms..."
      onSearch={(query) => setSearchQuery(query)}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="pt-8 pb-4 px-4 sm:px-6">
          <Container className="w-full max-w-none">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger value="dashboard">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="forms">
                  <FormInput className="mr-2 h-4 w-4" />
                  Forms
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Company Dashboard</h1>
                    <p className="text-muted-foreground">Overview of key stats and activities</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={handleCreateEnquiry}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Enquiry
                    </Button>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((card, i) => (
                    <Card key={i} className="shadow-sm">
                      <CardContent className="p-6">
                        <div className="text-muted-foreground text-sm mb-2">{card.label}</div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-semibold">{card.value}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            card.changeType === "positive" 
                              ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                              : card.changeType === "negative"
                                ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                                : "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800/30"
                          }`}>
                            {card.change}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Empty State */}
                <div className="bg-card rounded-lg border shadow-sm p-8 text-center mb-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Start managing your customer enquiries by adding your first enquiry or integrating our form to your website.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleNewEnquiry}>
                      Add First Enquiry
                    </Button>
                    <Button variant="outline" onClick={handleCreateForm}>
                      Create Form
                    </Button>
                  </div>
                </div>

                {/* Enquiry Board */}
                <div className="pb-8">
                  <Container className="w-full max-w-none">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-medium">Enquiry Board</h2>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Feature coming soon", description: "Filter functionality is coming soon." })}>
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button size="sm" onClick={handleNewEnquiry}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Enquiry
                        </Button>
                      </div>
                    </div>
                  </Container>
                  <KanbanBoard isDemo={false} />
                </div>
              </TabsContent>

              {/* Forms Tab */}
              <TabsContent value="forms">
                <FormManagement onCreateNew={handleCreateForm} />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Analytics & Reports</h2>
                  <p className="text-muted-foreground">Monitor performance metrics and track business growth</p>
                </div>
                
                {analyticsData.enquiries.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <AnalyticsChart
                      title="Enquiry Trends"
                      description="Enquiries received over time"
                      data={analyticsData.enquiries}
                      barColor="#0ea5e9"
                    />
                    <AnalyticsChart
                      title="Conversion Rate"
                      description="Percentage of enquiries converted to sales"
                      data={analyticsData.conversion}
                      barColor="#10b981"
                    />
                    <AnalyticsChart
                      title="Response Time"
                      description="Average time to respond to enquiries"
                      data={analyticsData.response}
                      barColor="#f59e0b"
                    />
                    <AnalyticsChart
                      title="Revenue Generated"
                      description="Revenue from converted enquiries"
                      data={analyticsData.revenue}
                      barColor="#8b5cf6"
                    />
                  </div>
                ) : (
                  <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BarChart2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Analytics Data Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Start receiving and managing enquiries to generate analytics data.
                    </p>
                    <Button onClick={handleCreateForm}>
                      Create Your First Form
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Container>
        </div>
      </main>
    </AppLayout>
  );
}
