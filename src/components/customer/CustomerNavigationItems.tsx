
import { 
  LayoutDashboard, 
  Building, 
  MessageSquare, 
  Mail, 
  CreditCard, 
  User, 
  Bell, 
  HelpCircle, 
  AtSign, 
  MessageCircle, 
  Inbox,
  Star,
  FileText,
  Clock,
  Settings,
  BookOpen
} from "lucide-react";

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
    path: "/customer/enquiries",
    children: [
      {
        id: "all-enquiries",
        label: "All Enquiries",
        icon: <FileText className="h-5 w-5" />,
        description: "View all your enquiries",
        path: "/customer/enquiries"
      },
      {
        id: "active-enquiries",
        label: "Active",
        icon: <Clock className="h-5 w-5" />,
        description: "View active enquiries",
        path: "/customer/enquiries/active"
      },
      {
        id: "completed-enquiries",
        label: "Completed",
        icon: <Star className="h-5 w-5" />,
        description: "View completed enquiries",
        path: "/customer/enquiries/completed"
      }
    ]
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
    path: "/customer/support",
    children: [
      {
        id: "support-tickets",
        label: "My Tickets",
        icon: <MessageSquare className="h-5 w-5" />,
        description: "View your support tickets",
        path: "/customer/support/tickets"
      },
      {
        id: "support-knowledge",
        label: "Knowledge Base",
        icon: <BookOpen className="h-5 w-5" />,
        description: "Browse help articles",
        path: "/customer/support/knowledge"
      }
    ]
  },
  { 
    id: "profile", 
    label: "Settings", 
    icon: <Settings className="h-5 w-5" />, 
    description: "Update account details and preferences",
    path: "/customer/settings"
  }
];
