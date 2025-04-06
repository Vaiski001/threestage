import { useState } from "react";
import { Search, Filter, MessageSquare, HelpCircle, ChevronRight, Plus, Clock, CheckCircle, XCircle, MoreHorizontal, Mail, Phone, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock support tickets
const supportTickets = [
  {
    id: "TKT-001",
    subject: "Issue with form submission",
    description: "I'm having trouble submitting a form to Acme Construction.",
    status: "open",
    priority: "medium",
    createdAt: "Today, 10:30 AM",
    lastUpdated: "Today, 11:30 AM",
    messages: [
      {
        id: "msg1",
        from: "user",
        message: "I'm unable to submit the quote request form for Acme Construction. It keeps giving me an error about missing fields, but all fields are filled out.",
        timestamp: "Today, 10:30 AM"
      },
      {
        id: "msg2",
        from: "agent",
        agent: {
          name: "Sarah Johnson",
          avatar: "SJ"
        },
        message: "Hi there! I'm sorry to hear you're having trouble. Could you please tell me which specific form you're trying to submit, and what browser you're using?",
        timestamp: "Today, 11:30 AM"
      }
    ]
  },
  {
    id: "TKT-002",
    subject: "Billing question regarding invoice #INV-001",
    description: "I have a question about a charge on my recent invoice from Acme Construction.",
    status: "open",
    priority: "high",
    createdAt: "Yesterday, 3:15 PM",
    lastUpdated: "Yesterday, 4:20 PM",
    messages: [
      {
        id: "msg1",
        from: "user",
        message: "I noticed a charge for 'Additional Consultation Fee' on invoice #INV-001 from Acme Construction, but I don't recall having an additional consultation. Could you help clarify this?",
        timestamp: "Yesterday, 3:15 PM"
      },
      {
        id: "msg2",
        from: "agent",
        agent: {
          name: "Mike Peterson",
          avatar: "MP"
        },
        message: "Hello! I'd be happy to look into this for you. I'll need to check the details of this invoice with our billing department and the service records from Acme Construction. I'll get back to you as soon as possible with more information.",
        timestamp: "Yesterday, 4:20 PM"
      }
    ]
  },
  {
    id: "TKT-003",
    subject: "Unable to access my enquiry history",
    description: "I can't see my past enquiries in my dashboard.",
    status: "closed",
    priority: "medium",
    createdAt: "Jan 15, 2024",
    closedAt: "Jan 16, 2024",
    lastUpdated: "Jan 16, 2024",
    messages: [
      {
        id: "msg1",
        from: "user",
        message: "When I try to view my enquiry history, I'm getting a blank page. This was working fine last week.",
        timestamp: "Jan 15, 2024"
      },
      {
        id: "msg2",
        from: "agent",
        agent: {
          name: "David Wilson",
          avatar: "DW"
        },
        message: "Thank you for reporting this issue. We're experiencing a temporary glitch with the enquiry history display. Our technical team is working on it, and it should be resolved within the next 24 hours.",
        timestamp: "Jan 15, 2024"
      },
      {
        id: "msg3",
        from: "agent",
        agent: {
          name: "David Wilson",
          avatar: "DW"
        },
        message: "Good news! The issue with the enquiry history has been resolved. Please try accessing it now and let us know if you still experience any problems.",
        timestamp: "Jan 16, 2024"
      },
      {
        id: "msg4",
        from: "user",
        message: "It's working now! Thanks for the quick fix.",
        timestamp: "Jan 16, 2024"
      }
    ]
  }
];

// FAQ items
const faqItems = [
  {
    question: "How do I create a new enquiry?",
    answer: "To create a new enquiry, first find and select the company you'd like to work with from the company directory. Then, click on the 'Submit Enquiry' button on their profile page. Fill out the required details in the form, and submit it. You'll receive a confirmation once your enquiry has been sent successfully."
  },
  {
    question: "How can I track the status of my enquiry?",
    answer: "You can track the status of your enquiries by navigating to the 'My Enquiries' section in your dashboard. Here, you'll see a list of all your enquiries with their current status. Click on any enquiry to view detailed information, including any responses from the company and the full history of status changes."
  },
  {
    question: "Where can I find my invoices?",
    answer: "Your invoices can be found in the 'Billing & Payments' section of your account. This section provides a comprehensive list of all invoices, both paid and unpaid. You can filter by date, company, or payment status. Each invoice can be viewed in detail or downloaded as a PDF."
  },
  {
    question: "How do I update my contact information?",
    answer: "To update your contact information, go to the 'Settings' page from your dashboard. Under the 'Profile' section, you'll find fields for your name, email, phone number, and address. Make the necessary changes and click 'Save Changes' to update your information. Remember to verify your email if you change it."
  },
  {
    question: "Can I change my notification preferences?",
    answer: "Yes, you can customize your notification preferences in the 'Notifications' section of your settings. Here, you can choose which types of notifications you'd like to receive (e.g., enquiry updates, new messages) and through which channels (email, SMS, push notifications). You can also set up quiet hours during which you won't receive notifications."
  },
  {
    question: "What should I do if a company isn't responding to my enquiry?",
    answer: "If a company hasn't responded to your enquiry within a reasonable timeframe (typically 2-3 business days), you can try contacting them directly using the contact information on their profile. If you still don't receive a response, you can report the issue to our support team by creating a support ticket, and we'll follow up with the company on your behalf."
  }
];

// Contact options
const contactOptions = [
  {
    method: "Email",
    icon: <Mail className="h-5 w-5" />,
    value: "support@enquirymanagement.com",
    description: "Our team typically responds within 24 hours on business days."
  },
  {
    method: "Phone",
    icon: <Phone className="h-5 w-5" />,
    value: "+1 (555) 123-4567",
    description: "Available Monday to Friday, 9 AM to 5 PM ET."
  },
  {
    method: "Help Center",
    icon: <ExternalLink className="h-5 w-5" />,
    value: "Visit our Help Center",
    url: "#",
    description: "Comprehensive guides and troubleshooting tips."
  }
];

export default function CustomerSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tickets");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  
  // Filter support tickets based on search query
  const filteredTickets = supportTickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter FAQ items based on search query
  const filteredFaqItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
    item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Customer Support</h1>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <Tabs 
          defaultValue="tickets" 
          className="w-full" 
          onValueChange={value => {
            setActiveTab(value);
            setSelectedTicket(null);
          }}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="tickets">My Support Tickets</TabsTrigger>
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>
            
            {selectedTicket ? (
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                    <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Tickets
                  </Button>
                  <div className="flex items-center gap-2">
                    {supportTickets.find(t => t.id === selectedTicket)?.status === "open" ? (
                      <Button variant="outline" size="sm">Close Ticket</Button>
                    ) : (
                      <Button variant="outline" size="sm">Reopen Ticket</Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Print</DropdownMenuItem>
                        <DropdownMenuItem>Download as PDF</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{supportTickets.find(t => t.id === selectedTicket)?.subject}</CardTitle>
                        <CardDescription>
                          {supportTickets.find(t => t.id === selectedTicket)?.id} • Created on {supportTickets.find(t => t.id === selectedTicket)?.createdAt}
                        </CardDescription>
                      </div>
                      <Badge variant={supportTickets.find(t => t.id === selectedTicket)?.status === "open" ? "outline" : "secondary"}>
                        {supportTickets.find(t => t.id === selectedTicket)?.status === "open" ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Description</h3>
                        <p className="text-sm text-muted-foreground">
                          {supportTickets.find(t => t.id === selectedTicket)?.description}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Conversation</h3>
                        {supportTickets.find(t => t.id === selectedTicket)?.messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.from === "agent" && message.agent && (
                              <Avatar className="h-8 w-8 mr-3 mt-1 bg-primary text-primary-foreground">
                                <span>{message.agent.avatar}</span>
                              </Avatar>
                            )}
                            <div className={`max-w-[75%] rounded-lg p-3 ${
                              message.from === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            }`}>
                              {message.from === "agent" && message.agent && (
                                <div className="text-xs font-medium mb-1">
                                  {message.agent.name}
                                </div>
                              )}
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${
                                message.from === "user" 
                                  ? "text-primary-foreground/70" 
                                  : "text-muted-foreground"
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  {supportTickets.find(t => t.id === selectedTicket)?.status === "open" && (
                    <CardFooter className="border-t pt-4">
                      <div className="w-full">
                        <Input
                          placeholder="Type your reply..."
                          className="mb-2"
                        />
                        <div className="flex justify-end">
                          <Button>Send Reply</Button>
                        </div>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </div>
            ) : (
              <Card>
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <div 
                          key={ticket.id}
                          className="p-4 hover:bg-secondary/50 cursor-pointer"
                          onClick={() => setSelectedTicket(ticket.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {ticket.status === "open" ? (
                                <Clock className="h-5 w-5 text-amber-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">{ticket.subject}</h3>
                                <Badge variant={ticket.status === "open" ? "outline" : "secondary"} className="ml-2">
                                  {ticket.status === "open" ? "Open" : "Closed"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {ticket.id} • Last updated: {ticket.lastUpdated}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {ticket.description}
                              </p>
                              <div className="flex justify-end mt-2">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium mb-1">No tickets found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery 
                            ? "No tickets match your search criteria" 
                            : "You haven't created any support tickets yet"}
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create a New Ticket
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-4">
            <div className="relative w-full max-w-md mx-auto mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search frequently asked questions..."
                className="pl-8"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about using our platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFaqItems.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqItems.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <HelpCircle className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn't find any FAQ items matching your search.
                    </p>
                    <Button variant="outline" onClick={() => setFaqSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for?
                </p>
                <Button variant="outline" onClick={() => setActiveTab("contact")}>
                  Contact Support
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Our Support Team</CardTitle>
                <CardDescription>
                  We're here to help. Choose your preferred contact method below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {contactOptions.map((option, index) => (
                    <div key={index} className="flex items-start p-4 border rounded-md">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{option.method}</h3>
                        {option.url ? (
                          <a href={option.url} className="text-primary hover:underline flex items-center">
                            {option.value}
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                          </a>
                        ) : (
                          <p className="text-sm font-medium">{option.value}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>
                  Fill out the form below to create a new support ticket.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Brief description of your issue" />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea 
                      id="description" 
                      rows={5}
                      className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="Please provide as much detail as possible about your issue"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <select 
                      id="priority"
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="low">Low - Not urgent</option>
                      <option value="medium">Medium - Need help soon</option>
                      <option value="high">High - Urgent issue</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Submit Support Ticket</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 