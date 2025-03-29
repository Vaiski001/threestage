
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Bell, 
  Calendar, 
  InfoIcon, 
  AlertCircle,
  Check,
  HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: 'message' | 'reminder' | 'update' | 'alert';
  title: string;
  content: string;
  time: string;
  day: string;
  isImportant?: boolean;
  actionUrl?: string;
  actionText?: string;
  companyName?: string;
  companyId?: string;
}

export function ActivityNotifications() {
  // Empty state for a new account
  const notifications: Notification[] = [];
  
  const markAllAsRead = () => {
    // Implementation would go here
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'update':
        return <InfoIcon className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTimeBadge = (day: string) => {
    const dayMap: Record<string, string> = {
      'TODAY': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'YESTERDAY': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    };

    return dayMap[day] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center">
          <CardTitle className="text-lg font-bold">Activity & Notifications</CardTitle>
          {notifications.length > 0 && (
            <Badge className="ml-2 bg-primary text-white">
              {notifications.length} New
            </Badge>
          )}
        </div>
        
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {notifications.length > 0 ? (
          <>
            <div className="space-y-1">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className="p-3 hover:bg-accent rounded-lg flex items-start gap-3"
                >
                  <div className="bg-background rounded-full p-2 border">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium mr-2">{notification.title}</h4>
                        {notification.isImportant && (
                          <Badge variant="outline" className="text-xs text-amber-500 border-amber-200">
                            Important
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getTimeBadge(notification.day)}`}
                      >
                        {notification.time}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>
                    
                    {notification.companyName && (
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Link 
                          to={`/companies/${notification.companyId}`}
                          className="hover:text-primary hover:underline"
                        >
                          {notification.companyName}
                        </Link>
                      </div>
                    )}
                    
                    {notification.actionUrl && (
                      <Button asChild size="sm" variant="outline" className="mt-1 h-7 text-xs">
                        <Link to={notification.actionUrl}>
                          {notification.actionText || "View Details"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              asChild
            >
              <Link to="/customer/notifications">
                View all notifications
              </Link>
            </Button>
          </>
        ) : (
          <div className="py-12 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No activity to display</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Notifications about your enquiries and activity will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
