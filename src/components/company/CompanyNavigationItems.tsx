import { LayoutDashboard, MessageSquare, Mail, FormInput, Receipt, DollarSign, PieChart, UserPlus, Users, Settings, HelpCircle, AtSign, MessageCircle, Inbox, Bell, CreditCard } from "lucide-react";
import { NavigationItem } from "../customer/CustomerNavigationItems";

export const companyNavigationItems: NavigationItem[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: <LayoutDashboard className="h-5 w-5" />, 
    description: "Overview of key stats and activities",
    path: "/company/dashboard"
  },
  { 
    id: "enquiries", 
    label: "Enquiries", 
    icon: <MessageSquare className="h-5 w-5" />, 
    description: "View and manage customer enquiries",
    path: "/company/enquiries"
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
        path: "/company/messaging/email"
      },
      {
        id: "messaging-chat",
        label: "Live Chat",
        icon: <MessageCircle className="h-5 w-5" />,
        description: "Live chat messages",
        path: "/company/messaging/chat"
      },
      {
        id: "messaging-inbox",
        label: "Inbox",
        icon: <Inbox className="h-5 w-5" />,
        description: "Unified inbox for all messages",
        path: "/company/messaging/inbox"
      }
    ]
  },
  { 
    id: "forms", 
    label: "Form Builder", 
    icon: <FormInput className="h-5 w-5" />, 
    description: "Create and manage forms",
    path: "/company/forms"
  },
  { 
    id: "billing", 
    label: "Billing", 
    icon: <CreditCard className="h-5 w-5" />, 
    description: "Manage subscriptions and billing",
    path: "/company/billing"
  },
  { 
    id: "invoices", 
    label: "Invoices", 
    icon: <Receipt className="h-5 w-5" />, 
    description: "Manage invoices and billing",
    path: "/company/invoices"
  },
  { 
    id: "payments", 
    label: "Payments", 
    icon: <DollarSign className="h-5 w-5" />, 
    description: "Track payments and transactions",
    path: "/company/payments"
  },
  { 
    id: "reports", 
    label: "Reports & Analytics", 
    icon: <PieChart className="h-5 w-5" />, 
    description: "Insights and trends",
    path: "/company/reports"
  },
  { 
    id: "team", 
    label: "Team Management", 
    icon: <UserPlus className="h-5 w-5" />, 
    description: "Manage company users and roles",
    path: "/company/team"
  },
  { 
    id: "customers", 
    label: "Customers", 
    icon: <Users className="h-5 w-5" />, 
    description: "List of customers with their details",
    path: "/company/customers"
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    icon: <Bell className="h-5 w-5" />, 
    description: "View and manage notifications",
    path: "/company/notifications"
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: <Settings className="h-5 w-5" />, 
    description: "Configure company details and preferences",
    path: "/company/settings"
  },
  { 
    id: "support", 
    label: "Support", 
    icon: <HelpCircle className="h-5 w-5" />, 
    description: "Get help and support",
    path: "/company/support"
  }
];
