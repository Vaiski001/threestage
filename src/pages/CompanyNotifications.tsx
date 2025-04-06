import { useState } from "react";
import { Bell, Check, Clock, Filter, MoreHorizontal, Search, Settings, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock notifications data
const notifications = [
  {
    id: "n1",
    title: "New Enquiry Received",
    description: "You have received a new enquiry from John Doe about Kitchen Renovation.",
    timestamp: "10 minutes ago",
    read: false,
    type: "enquiry",
    action: "view",
    actionLabel: "View Enquiry",
    link: "/company/enquiries/ENQ-001",
    priority: "high"
  },
  {
    id: "n2",
    title: "Customer Message",
    description: "Sarah Smith has sent you a new message regarding their Bathroom Remodel enquiry.",
    timestamp: "1 hour ago",
    read: false,
    type: "message",
    action: "reply",
    actionLabel: "Reply",
    link: "/company/messages/chat/2",
    priority: "medium"
  },
  {
    id: "n3",
    title: "Task Due Today",
    description: "Follow up with Michael Johnson about the Deck Construction project estimate.",
    timestamp: "3 hours ago",
    read: true,
    type: "task",
    action: "complete",
    actionLabel: "Mark Complete",
    link: "/company/tasks/t-003",
    priority: "high"
  },
  {
    id: "n4",
    title: "Appointment Reminder",
    description: "You have a consultation with Emily Wilson tomorrow at 10:00 AM for the Fence Installation project.",
    timestamp: "Yesterday",
    read: true,
    type: "appointment",
    action: "view",
    actionLabel: "View Appointment",
    link: "/company/calendar/apt-004",
    priority: "medium"
  },
  {
    id: "n5",
    title: "Enquiry Status Updated",
    description: "The status of David Brown's Flooring Installation enquiry has been updated to 'Completed'.",
    timestamp: "2 days ago",
    read: true,
    type: "update",
    action: "view",
    actionLabel: "View Details",
    link: "/company/enquiries/ENQ-005",
    priority: "low"
  },
  {
    id: "n6",
    title: "Team Member Mention",
    description: "Alex Miller mentioned you in a comment on Amanda Garcia's Home Renovation enquiry.",
    timestamp: "3 days ago",
    read: true,
    type: "mention",
    action: "view",
    actionLabel: "View Comment",
    link: "/company/enquiries/ENQ-006/comments",
    priority: "medium"
  },
  {
    id: "n7",
    title: "Payment Received",
    description: "You've received a payment of $2,500 from Robert Taylor for the Basement Finishing project.",
    timestamp: "4 days ago",
    read: true,
    type: "payment",
    action: "view",
    actionLabel: "View Payment",
    link: "/company/finances/payments/p-007",
    priority: "high"
  },
  {
    id: "n8",
    title: "Subscription Renewal",
    description: "Your Professional Plan subscription will renew in 7 days. The amount of $99 will be charged to your default payment method.",
    timestamp: "5 days ago",
    read: true,
    type: "system",
    action: "view",
    actionLabel: "Manage Subscription",
    link: "/company/billing",
    priority: "medium"
  }
];

// Notification settings
const notificationSettings = [
  {
    id: "enquiry_notifications",
    title: "Enquiry Notifications",
    description: "Receive notifications for new enquiries and updates",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "message_notifications",
    title: "Message Notifications",
    description: "Receive notifications for new customer messages",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "appointment_notifications",
    title: "Appointment Notifications",
    description: "Receive reminders for upcoming appointments",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "task_notifications",
    title: "Task Notifications",
    description: "Receive notifications for task assignments and due dates",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "payment_notifications",
    title: "Payment Notifications",
    description: "Receive notifications for payments and invoices",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "system_notifications",
    title: "System Notifications",
    description: "Receive notifications about your account and subscription",
    email: true,
    push: false,
    sms: false,
  }
];

// Format relative time function
const formatRelativeTime = (timeString: string) => {
  // Simple function - in a real app, you'd use a proper date-time library
  return timeString;
};

// Get notification icon function
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'enquiry':
      return <Badge className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">E</Badge>;
    case 'message':
      return <Badge className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">M</Badge>;
    case 'task':
      return <Badge className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">T</Badge>;
    case 'appointment':
      return <Badge className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">A</Badge>;
    case 'update':
      return <Badge className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">U</Badge>;
    case 'mention':
      return <Badge className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">@</Badge>;
    case 'payment':
      return <Badge className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">P</Badge>;
    case 'system':
      return <Badge className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">S</Badge>;
    default:
      return <Badge className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">N</Badge>;
  }
};

export default function CompanyNotifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState(notificationSettings);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    // In a real app, this would update the database
    console.log(`Marking notification ${id} as read`);
  };
  
  // Update notification settings
  const updateSetting = (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id 
          ? { ...setting, [channel]: value } 
          : setting
      )
    );
  };
  
  // Filter notifications based on current view and search query
  const filteredNotifications = notifications.filter(notification => {
    // Search filtering
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filtering
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return !notification.read && matchesSearch;
    if (activeTab === "enquiries") return notification.type === "enquiry" && matchesSearch;
    if (activeTab === "messages") return notification.type === "message" && matchesSearch;
    if (activeTab === "tasks") return notification.type === "task" && matchesSearch;
    if (activeTab === "system") return notification.type === "system" && matchesSearch;
    
    return matchesSearch;
  });
  
  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Company Notifications</h1>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 pt-2">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>All</TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setActiveTab("unread")}>Unread</TabsTrigger>
            <TabsTrigger value="enquiries" onClick={() => setActiveTab("enquiries")}>Enquiries</TabsTrigger>
            <TabsTrigger value="messages" onClick={() => setActiveTab("messages")}>Messages</TabsTrigger>
            <TabsTrigger value="tasks" onClick={() => setActiveTab("tasks")}>Tasks</TabsTrigger>
            <TabsTrigger value="system" onClick={() => setActiveTab("system")}>System</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-8 w-[240px] h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Filter by date
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Filter by priority
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Clear filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4">
          <TabsContent value="all" className="m-0 col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  View and manage your notifications
                </CardDescription>
              </CardHeader>
              <ScrollArea className="flex-1">
                <CardContent>
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex items-start p-3 rounded-lg ${
                            notification.read ? 'bg-background' : 'bg-muted/30'
                          } ${notification.priority === 'high' ? 'border-l-4 border-destructive' : ''}`}
                        >
                          <div className="mr-3 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      {notification.read ? 'Mark as unread' : 'Mark as read'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Mute this type of notification
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      Dismiss
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                {notification.actionLabel}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg mb-1">No notifications</h3>
                        <p className="text-muted-foreground">
                          {searchQuery ? 'No notifications match your search' : 'All caught up!'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread" className="m-0 col-span-2">
            {/* Similar structure for unread notifications */}
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>
                  View your unread notifications
                </CardDescription>
              </CardHeader>
              <ScrollArea className="flex-1">
                <CardContent>
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex items-start p-3 rounded-lg bg-muted/30 ${
                            notification.priority === 'high' ? 'border-l-4 border-destructive' : ''
                          }`}
                        >
                          <div className="mr-3 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold">
                                {notification.title}
                              </h3>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      Mark as read
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Mute this type of notification
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      Dismiss
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                {notification.actionLabel}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Check className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-medium text-lg mb-1">All caught up!</h3>
                        <p className="text-muted-foreground">
                          You have no unread notifications
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </TabsContent>
          
          {/* Other tabs would follow the same pattern */}
          <TabsContent value="enquiries" className="m-0 col-span-2">
            {/* Enquiries notifications content */}
          </TabsContent>
          
          <TabsContent value="messages" className="m-0 col-span-2">
            {/* Messages notifications content */}
          </TabsContent>
          
          <TabsContent value="tasks" className="m-0 col-span-2">
            {/* Tasks notifications content */}
          </TabsContent>
          
          <TabsContent value="system" className="m-0 col-span-2">
            {/* System notifications content */}
          </TabsContent>
          
          <div className="col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {settings.map((setting) => (
                    <div key={setting.id}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{setting.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="flex items-center justify-between rounded-md border p-2">
                          <span className="text-sm">Email</span>
                          <Switch 
                            checked={setting.email} 
                            onCheckedChange={(value) => updateSetting(setting.id, 'email', value)} 
                          />
                        </div>
                        <div className="flex items-center justify-between rounded-md border p-2">
                          <span className="text-sm">Push</span>
                          <Switch 
                            checked={setting.push} 
                            onCheckedChange={(value) => updateSetting(setting.id, 'push', value)} 
                          />
                        </div>
                        <div className="flex items-center justify-between rounded-md border p-2">
                          <span className="text-sm">SMS</span>
                          <Switch 
                            checked={setting.sms} 
                            onCheckedChange={(value) => updateSetting(setting.id, 'sms', value)} 
                          />
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Schedule</CardTitle>
                <CardDescription>
                  Set your working hours for notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Work Hours Start</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option>8:00 AM</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Work Hours End</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option>5:00 PM</option>
                        <option>6:00 PM</option>
                        <option>7:00 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Work Days</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <Button 
                          key={day} 
                          variant={index < 5 ? "default" : "outline"} 
                          size="sm" 
                          className="px-3 min-w-[40px]"
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Do Not Disturb</span>
                      <span className="text-xs text-muted-foreground">
                        Disable all notifications outside work hours
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Schedule</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
} 