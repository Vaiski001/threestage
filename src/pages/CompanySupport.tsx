import { useState } from "react";
import { Search, HelpCircle, FileText, MessageSquare, Mail, Phone, ExternalLink, Clock, ArrowRight, BookOpen, CheckCircle2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock support tickets
const supportTickets = [
  {
    id: "T-1001",
    title: "Unable to update customer profile",
    description: "I'm trying to update a customer's contact information but getting an error message every time I save changes.",
    status: "open",
    priority: "high",
    category: "account",
    created: "2023-07-15T14:30:00",
    updated: "2023-07-15T16:45:00",
    responses: 2
  },
  {
    id: "T-1002",
    title: "Integration with accounting software",
    description: "Need help setting up the integration between your platform and our QuickBooks account.",
    status: "in_progress",
    priority: "medium",
    category: "integration",
    created: "2023-07-14T09:15:00",
    updated: "2023-07-15T11:20:00",
    responses: 3
  },
  {
    id: "T-1003",
    title: "Billing discrepancy on latest invoice",
    description: "There seems to be a charge for additional users on our latest invoice, but we haven't added any new team members.",
    status: "waiting",
    priority: "medium",
    category: "billing",
    created: "2023-07-12T13:45:00",
    updated: "2023-07-13T10:30:00",
    responses: 1
  },
  {
    id: "T-1004",
    title: "Feature request: Bulk message sending",
    description: "Would like to request the ability to send a single message to multiple customers at once for project updates.",
    status: "open",
    priority: "low",
    category: "feature_request",
    created: "2023-07-10T15:20:00",
    updated: "2023-07-10T15:20:00",
    responses: 0
  },
  {
    id: "T-1005",
    title: "Email notifications not being received",
    description: "Our team isn't getting email notifications when new enquiries come in, despite having them enabled in settings.",
    status: "closed",
    priority: "high",
    category: "notifications",
    created: "2023-07-05T08:30:00",
    updated: "2023-07-08T14:15:00",
    responses: 4
  }
];

// Mock FAQs
const faqs = [
  {
    id: "faq1",
    category: "account",
    question: "How do I add team members to my company account?",
    answer: "To add team members, go to Settings > Team Management > Invite Member. Enter their email address and select their role (Admin, Manager, or Team Member). They will receive an email invitation to create their account."
  },
  {
    id: "faq2",
    category: "billing",
    question: "How is the monthly enquiry limit calculated?",
    answer: "Enquiries are counted toward your monthly limit when they are first received. Each unique customer enquiry counts as one, regardless of how many messages are exchanged afterward. Your limit resets on your billing renewal date."
  },
  {
    id: "faq3",
    category: "messaging",
    question: "Can I use templates for responding to common enquiries?",
    answer: "Yes! You can create message templates under Settings > Message Templates. You can then use these templates when replying to customers through email, chat, or the inbox system."
  },
  {
    id: "faq4",
    category: "customer_management",
    question: "How do I export customer data for use in other systems?",
    answer: "You can export customer data in CSV or Excel format from the Customers page. Click on the 'Export' button in the top right corner, select the data fields you want to include, and choose your preferred format."
  },
  {
    id: "faq5",
    category: "integrations",
    question: "Which CRM systems can integrate with your platform?",
    answer: "We currently offer direct integrations with Salesforce, HubSpot, Zoho CRM, and Pipedrive. For other CRM systems, you can use our API or Zapier integration to connect them."
  },
  {
    id: "faq6",
    category: "reports",
    question: "Can I schedule reports to be sent automatically?",
    answer: "Yes, you can schedule automated report delivery under Reports > Schedule. Choose the report type, frequency (daily, weekly, monthly), and recipients. Reports will be delivered as PDF attachments."
  },
];

// Knowledge base articles
const knowledgeBaseArticles = [
  {
    id: "kb1",
    title: "Getting Started Guide",
    description: "Learn the basics of setting up your account and managing customer enquiries.",
    category: "getting_started",
    readTime: 5,
    popular: true
  },
  {
    id: "kb2",
    title: "Understanding the Enquiry Management Process",
    description: "A comprehensive overview of how enquiries move through the system.",
    category: "workflow",
    readTime: 8,
    popular: true
  },
  {
    id: "kb3",
    title: "Advanced Communication Features",
    description: "Learn about email tracking, scheduled messages, and template variables.",
    category: "messaging",
    readTime: 6,
    popular: false
  },
  {
    id: "kb4",
    title: "Creating and Using Customer Tags",
    description: "Organize your customer base with custom tags and segments.",
    category: "customer_management",
    readTime: 4,
    popular: false
  },
  {
    id: "kb5",
    title: "Reporting and Analytics Guide",
    description: "How to generate and interpret performance reports for your business.",
    category: "reports",
    readTime: 7,
    popular: true
  },
  {
    id: "kb6",
    title: "Security Best Practices",
    description: "Recommendations for keeping your account and customer data secure.",
    category: "security",
    readTime: 5,
    popular: false
  },
  {
    id: "kb7",
    title: "API Documentation",
    description: "Technical guide for developers integrating with our platform.",
    category: "developers",
    readTime: 12,
    popular: false
  },
  {
    id: "kb8",
    title: "Mobile App Features",
    description: "Guide to using our mobile app for on-the-go enquiry management.",
    category: "mobile",
    readTime: 4,
    popular: true
  },
];

// Format date helper function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Open</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">In Progress</Badge>;
    case 'waiting':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Awaiting Response</Badge>;
    case 'closed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Get priority badge
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">High</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export default function CompanySupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(supportTickets);
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [filteredArticles, setFilteredArticles] = useState(knowledgeBaseArticles);
  
  // Search handling
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Filter tickets
    const matchingTickets = supportTickets.filter(ticket => 
      ticket.title.toLowerCase().includes(query.toLowerCase()) ||
      ticket.description.toLowerCase().includes(query.toLowerCase()) ||
      ticket.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTickets(matchingTickets);
    
    // Filter FAQs
    const matchingFaqs = faqs.filter(faq => 
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFaqs(matchingFaqs);
    
    // Filter knowledge base articles
    const matchingArticles = knowledgeBaseArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArticles(matchingArticles);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Company Support Center</h1>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">How can we help you today?</h2>
            <p className="text-muted-foreground text-center mb-4">
              Search our knowledge base or check your support tickets
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help, articles, FAQs, or check ticket status..."
                className="pl-10 py-6 text-base"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Quick Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-lg mb-2">Live Chat</CardTitle>
              <CardDescription className="mb-4">
                Chat with our support team for immediate assistance
              </CardDescription>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-lg mb-2">Email Support</CardTitle>
              <CardDescription className="mb-4">
                Send us a detailed message about your issue
              </CardDescription>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-lg mb-2">New Ticket</CardTitle>
              <CardDescription className="mb-4">
                Create a support ticket for technical issues
              </CardDescription>
              <Button variant="outline" className="w-full">
                Create Ticket
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Phone className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-lg mb-2">Call Us</CardTitle>
              <CardDescription className="mb-4">
                Speak directly with our support team
              </CardDescription>
              <Button variant="outline" className="w-full">
                +1 (800) 123-4567
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="tickets">My Support Tickets</TabsTrigger>
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
          </TabsList>
          
          {/* Support Tickets Tab */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>
                      View and manage your support requests
                    </CardDescription>
                  </div>
                  <Button>
                    Create New Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted px-4 py-3 flex items-center font-medium text-sm border-b">
                    <div className="w-24">Ticket ID</div>
                    <div className="flex-1">Subject</div>
                    <div className="w-28 text-center">Status</div>
                    <div className="w-28 text-center">Priority</div>
                    <div className="w-36 text-center">Last Updated</div>
                    <div className="w-10"></div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <div 
                          key={ticket.id} 
                          className="px-4 py-3 border-b last:border-0 flex items-center text-sm hover:bg-secondary/50 cursor-pointer"
                        >
                          <div className="w-24 font-medium">{ticket.id}</div>
                          <div className="flex-1">
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-md">
                              {ticket.description}
                            </div>
                          </div>
                          <div className="w-28 text-center">
                            {getStatusBadge(ticket.status)}
                          </div>
                          <div className="w-28 text-center">
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <div className="w-36 text-center text-xs text-muted-foreground">
                            {formatDate(ticket.updated)}
                            <div className="text-xs">{ticket.responses > 0 ? `${ticket.responses} response${ticket.responses > 1 ? 's' : ''}` : 'No responses'}</div>
                          </div>
                          <div className="w-10 flex justify-end">
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg mb-1">No tickets found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery ? 'No support tickets match your search' : 'You have no open support tickets'}
                        </p>
                        <Button>Create a New Support Ticket</Button>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="flex justify-end mt-2">
                            <Badge variant="outline" className="text-xs">{faq.category.replace('_', ' ')}</Badge>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-1">No FAQs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try another search term or contact our support team for help
                    </p>
                    <Button>Contact Support</Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <p className="text-sm text-muted-foreground">Can't find what you're looking for?</p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Knowledge Base Tab */}
          <TabsContent value="kb">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Knowledge Base</CardTitle>
                    <CardDescription>
                      Detailed guides and documentation
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse All
                    </Button>
                    <Button variant="outline">
                      <Info className="h-4 w-4 mr-2" />
                      Request Topic
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="overflow-hidden">
                        <div className="flex items-center h-full border-0">
                          <div className="p-4 flex-1">
                            <div className="flex items-center">
                              <h3 className="font-medium">{article.title}</h3>
                              {article.popular && (
                                <Badge className="ml-2 bg-amber-100 text-amber-800 border-0">Popular</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {article.description}
                            </p>
                            <div className="flex items-center mt-3 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{article.readTime} min read</span>
                              <Badge variant="outline" className="ml-3 text-xs">
                                {article.category.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4 flex items-center justify-center">
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-1">No articles found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try another search term or browse our full knowledge base
                    </p>
                    <Button>Browse All Articles</Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col border-t p-4">
                <h3 className="font-medium mb-4">Popular Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(knowledgeBaseArticles.map(a => a.category))).map(category => (
                    <Button key={category} variant="outline" size="sm" className="text-xs">
                      {category.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Support Info */}
        <div className="mt-8 bg-muted rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex">
              <div className="mr-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Support Hours</h3>
                <p className="text-sm">Monday-Friday: 9am - 6pm EST</p>
                <p className="text-sm">Saturday: 10am - 2pm EST</p>
                <p className="text-sm">Sunday: Closed</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Service Status</h3>
                <p className="text-sm text-green-600 font-medium">All systems operational</p>
                <p className="text-sm mt-1">Last updated: 2 hours ago</p>
                <p className="text-sm mt-1 underline cursor-pointer">View status page</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <ExternalLink className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Training Resources</h3>
                <p className="text-sm">Access free webinars, tutorials and guides</p>
                <Button variant="link" className="px-0 h-7 text-sm">Schedule a training session</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 