
import { LayoutDashboard, Building, MessageSquare, Mail, CreditCard, User, Bell, HelpCircle, AtSign, MessageCircle, Inbox } from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  path?: string;
  children?: NavigationItem[];
}

export const customerNavigationItems: NavigationItem[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: <LayoutDashboard className="h-5 w-5" />, 
    description: "Overview of your enquiries and activities",
    path: "/customer/dashboard"
  },
  { 
    id: "companies", 
    label: "Find Companies", 
    icon: <Building className="h-5 w-5" />, 
    description: "Search and discover companies to work with",
    path: "/companies"
  },
  { 
    id: "enquiries", 
    label: "My Enquiries", 
    icon: <MessageSquare className="h-5 w-5" />, 
    description: "Track and manage your conversations with companies", 
    path: "/customer/enquiries" 
  },
  {
    id: "messaging",
    label: "Messaging",
    icon: <Mail className="h-5 w-5" />,
    description: "Message channels and communication",
    children: [
      {
        id: "messaging-email",
        label: "Email",
        icon: <AtSign className="h-5 w-5" />,
        description: "Email messages",
        path: "/customer/messaging/email"
      },
      {
        id: "messaging-chat",
        label: "Live Chat",
        icon: <MessageCircle className="h-5 w-5" />,
        description: "Live chat messages",
        path: "/customer/messaging/chat"
      },
      {
        id: "messaging-inbox",
        label: "Inbox",
        icon: <Inbox className="h-5 w-5" />,
        description: "All messages inbox",
        path: "/customer/messaging/inbox"
      }
    ]
  },
  { 
    id: "billing", 
    label: "Billing & Payments", 
    icon: <CreditCard className="h-5 w-5" />, 
    description: "View invoices and make payments",
    path: "/customer/billing"
  },
  { 
    id: "profile", 
    label: "Profile Settings", 
    icon: <User className="h-5 w-5" />, 
    description: "Update account details",
    path: "/customer/settings"
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    icon: <Bell className="h-5 w-5" />, 
    description: "View alerts and messages",
    path: "/customer/notifications"
  },
  { 
    id: "support", 
    label: "Support", 
    icon: <HelpCircle className="h-5 w-5" />, 
    description: "Contact customer service or FAQs",
    path: "/customer/support"
  }
];
