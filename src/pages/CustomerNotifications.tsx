import { useState } from "react";
import { Bell, Check, ChevronRight, Filter, Info, Mail, MessageCircle, MoreHorizontal, Phone, Search, Smartphone, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock notification history
const notificationHistory = [
  {
    id: "1",
    title: "Quote Available",
    message: "Acme Construction has prepared a quote for your enquiry #12345",
    type: "enquiry",
    date: "Today, 10:30 AM",
    read: false,
    company: "Acme Construction"
  },
  {
    id: "2",
    title: "New Message",
    message: "BuildRight Solutions sent you a message regarding your enquiry",
    type: "message",
    date: "Yesterday, 4:15 PM",
    read: true,
    company: "BuildRight Solutions"
  },
  {
    id: "3",
    title: "Status Update",
    message: "Your enquiry #12345 with Acme Construction has been updated to 'In Progress'",
    type: "status",
    date: "Yesterday, 2:30 PM",
    read: false,
    company: "Acme Construction"
  },
  {
    id: "4",
    title: "Form Submission Confirmed",
    message: "Your form submission to Elite Renovations has been received",
    type: "form",
    date: "Jan 15, 2024",
    read: true,
    company: "Elite Renovations"
  },
  {
    id: "5",
    title: "Appointment Scheduled",
    message: "Your appointment with Horizon Landscaping is confirmed for January 25, 10:00 AM",
    type: "appointment",
    date: "Jan 12, 2024",
    read: true,
    company: "Horizon Landscaping"
  }
];

// Notification preferences
const notificationChannels = [
  {
    id: "email",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
    enabled: true
  },
  {
    id: "sms",
    label: "SMS",
    icon: <Smartphone className="h-4 w-4" />,
    enabled: false
  },
  {
    id: "push",
    label: "Push Notifications",
    icon: <Bell className="h-4 w-4" />,
    enabled: true
  }
];

const notificationTypes = [
  {
    id: "enquiry_updates",
    label: "Enquiry Updates",
    description: "Status changes, new quotes, and other updates to your enquiries",
    email: true,
    sms: false,
    push: true
  },
  {
    id: "messages",
    label: "New Messages",
    description: "Receive notifications when you get new messages from companies",
    email: true,
    sms: true,
    push: true
  },
  {
    id: "appointments",
    label: "Appointment Reminders",
    description: "Get reminders about upcoming appointments",
    email: true,
    sms: true,
    push: true
  },
  {
    id: "forms",
    label: "Form Updates",
    description: "Notifications about form submissions and requests",
    email: true,
    sms: false,
    push: false
  },
  {
    id: "billing",
    label: "Billing & Payments",
    description: "Invoices, receipts, and payment confirmations",
    email: true,
    sms: false,
    push: true
  }
];

export default function CustomerNotifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelPreferences, setChannelPreferences] = useState(notificationChannels);
  const [typePreferences, setTypePreferences] = useState(notificationTypes);
  
  // Filter notifications based on search query
  const filteredNotifications = notificationHistory.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle notification channel
  const toggleChannel = (channelId: string) => {
    setChannelPreferences(prev => 
      prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, enabled: !channel.enabled } 
          : channel
      )
    );
  };
  
  // Toggle notification type for a specific channel
  const toggleNotificationType = (typeId: string, channel: string) => {
    setTypePreferences(prev => 
      prev.map(type => 
        type.id === typeId 
          ? { ...type, [channel]: !type[channel as keyof typeof type] } 
          : type
      )
    );
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "enquiry":
        return <Info className="h-4 w-4" />;
      case "message":
        return <MessageCircle className="h-4 w-4" />;
      case "status":
        return <Check className="h-4 w-4" />;
      case "form":
        return <Mail className="h-4 w-4" />;
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Notification History</TabsTrigger>
            <TabsTrigger value="preferences">Notification Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Mark All as Read
                </Button>
              </div>
            </div>
            
            <Card>
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-secondary/50 ${!notification.read ? "bg-primary-foreground/40" : ""}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            !notification.read ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.company} • {notification.date}
                              </p>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem>
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                {notification.read && (
                                  <DropdownMenuItem>
                                    Mark as Unread
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <p className="text-sm mt-1">
                            {notification.message}
                          </p>
                          
                          <div className="mt-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <ChevronRight className="h-3.5 w-3.5 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelPreferences.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {channel.icon}
                        <span>{channel.label}</span>
                      </div>
                      <Switch 
                        checked={channel.enabled} 
                        onCheckedChange={() => toggleChannel(channel.id)} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Customize which notifications you receive and how.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Notification Type</TableHead>
                      <TableHead className="text-center">Email</TableHead>
                      <TableHead className="text-center">SMS</TableHead>
                      <TableHead className="text-center">Push</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typePreferences.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{type.label}</p>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={type.email}
                            disabled={!channelPreferences.find(c => c.id === "email")?.enabled}
                            onCheckedChange={() => toggleNotificationType(type.id, "email")}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={type.sms}
                            disabled={!channelPreferences.find(c => c.id === "sms")?.enabled}
                            onCheckedChange={() => toggleNotificationType(type.id, "sms")}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={type.push}
                            disabled={!channelPreferences.find(c => c.id === "push")?.enabled}
                            onCheckedChange={() => toggleNotificationType(type.id, "push")}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>
                  Your notification contact information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">john.doe@example.com</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 