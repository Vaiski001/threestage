
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  Activity,
  Check,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface SupportReply {
  message: string;
  agentName: string;
  agentRole: string;
  timestamp: string;
}

export function SupportQuickAccess() {
  // Empty state for a new account
  const lastReply: SupportReply | null = null;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-bold">Support Quick Access</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          size="lg"
          asChild
        >
          <Link to="/customer/support">
            <MessageCircle className="h-4 w-4" />
            Create Support Ticket
          </Link>
        </Button>
        
        <div className="space-y-2">
          <Link to="/customer/support?tab=knowledge" className="flex items-center justify-between p-3 hover:bg-accent rounded-lg">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 text-primary mr-3" />
              <div>
                <h3 className="text-sm font-medium">Knowledge Base</h3>
                <p className="text-xs text-muted-foreground">Find answers to common questions</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          
          <Link to="/customer/support?tab=status" className="flex items-center justify-between p-3 hover:bg-accent rounded-lg">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium">System Status</h3>
                <p className="text-xs text-muted-foreground">Check system availability</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              All systems normal
            </Badge>
          </Link>
        </div>
        
        <div className="border-t pt-3">
          <h3 className="text-sm font-medium mb-2">Last Reply</h3>
          
          <div className="bg-accent/30 rounded-lg p-3 text-center">
            <HelpCircle className="h-5 w-5 mx-auto text-muted-foreground/50 mb-1" />
            <p className="text-sm text-muted-foreground">No support history yet</p>
            <p className="text-xs text-muted-foreground/70">
              Support replies will appear here
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
