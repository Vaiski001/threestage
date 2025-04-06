import { useState } from "react";
import { MessageCircle, Phone, Video, Paperclip, Smile, Send, Search, MoreHorizontal, UserPlus, Info, Image, File, Map } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for chat conversations
const conversations = [
  {
    id: "1",
    company: {
      name: "Acme Construction",
      avatar: "A",
      isOnline: true,
      lastSeen: "Just now"
    },
    lastMessage: {
      text: "We can schedule a consultation for next Tuesday at 10:00 AM. Would that work for you?",
      time: "10:42 AM",
      isRead: true,
      isFromMe: false
    },
    unreadCount: 0
  },
  {
    id: "2",
    company: {
      name: "BuildRight Solutions",
      avatar: "B",
      isOnline: false,
      lastSeen: "1 hour ago"
    },
    lastMessage: {
      text: "I've sent you the updated quote with the modifications you requested.",
      time: "Yesterday",
      isRead: false,
      isFromMe: false
    },
    unreadCount: 2
  },
  {
    id: "3",
    company: {
      name: "Elite Renovations",
      avatar: "E",
      isOnline: false,
      lastSeen: "3 hours ago"
    },
    lastMessage: {
      text: "Thank you for sharing your vision. I've made notes and will prepare a proposal.",
      time: "Wed",
      isRead: true,
      isFromMe: false
    },
    unreadCount: 0
  },
  {
    id: "4",
    company: {
      name: "Horizon Landscaping",
      avatar: "H", 
      isOnline: true,
      lastSeen: "Just now"
    },
    lastMessage: {
      text: "Yes, our team is available to start the project on the date you requested.",
      time: "Mon",
      isRead: true,
      isFromMe: false
    },
    unreadCount: 0
  },
  {
    id: "5",
    company: {
      name: "City Plumbing Services",
      avatar: "C",
      isOnline: false,
      lastSeen: "2 days ago"
    },
    lastMessage: {
      text: "I've added your property to our schedule for Monday, Jan 22 between 9-11 AM.",
      time: "Jan 10",
      isRead: true,
      isFromMe: false
    },
    unreadCount: 0
  }
];

// Mock data for a chat thread
const messages = [
  {
    id: "msg1",
    sender: "company",
    text: "Hello! Thank you for reaching out to Acme Construction. How can we help you today?",
    time: "10:30 AM"
  },
  {
    id: "msg2",
    sender: "user",
    text: "Hi, I'm interested in getting a quote for a kitchen renovation project.",
    time: "10:32 AM"
  },
  {
    id: "msg3",
    sender: "company",
    text: "Great! We'd be happy to provide a quote. Could you share some details about your kitchen renovation project? Size, scope, and any specific features you're looking for?",
    time: "10:35 AM"
  },
  {
    id: "msg4",
    sender: "user",
    text: "It's about 200 sq ft. We want new cabinets, countertops, flooring, and maybe moving a wall to open up the space.",
    time: "10:38 AM"
  },
  {
    id: "msg5",
    sender: "company",
    text: "Thank you for the details. Moving a wall may require structural engineering considerations. Would you be available for an on-site consultation so we can assess the space properly?",
    time: "10:40 AM"
  },
  {
    id: "msg6",
    sender: "user",
    text: "Yes, that sounds like a good idea. When would you be available?",
    time: "10:41 AM"
  },
  {
    id: "msg7",
    sender: "company",
    text: "We can schedule a consultation for next Tuesday at 10:00 AM. Would that work for you?",
    time: "10:42 AM"
  }
];

export default function CustomerChatMessaging() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1"); // Default to first chat
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = conversations.filter(
    conversation => conversation.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    // In a real app, you would send this message to your backend
    // For this mock-up, we're just clearing the input
    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Chat Messages</h1>
        </div>
      </div>
      <div className="grid h-full grid-cols-12 overflow-auto">
        {/* Chat list sidebar */}
        <div className="col-span-3 border-r h-full flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedChat === conversation.id ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => setSelectedChat(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{conversation.company.avatar}</span>
                          </Avatar>
                          {conversation.company.isOnline && (
                            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conversation.company.name}</p>
                            <p className="text-xs text-muted-foreground">{conversation.lastMessage.time}</p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-muted-foreground truncate mr-2">
                              {conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredConversations
                    .filter(conversation => conversation.unreadCount > 0)
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                          selectedChat === conversation.id ? "bg-secondary/50" : ""
                        }`}
                        onClick={() => setSelectedChat(conversation.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                              <span>{conversation.company.avatar}</span>
                            </Avatar>
                            {conversation.company.isOnline && (
                              <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.company.name}</p>
                              <p className="text-xs text-muted-foreground">{conversation.lastMessage.time}</p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-sm text-muted-foreground truncate mr-2">
                                {conversation.lastMessage.text}
                              </p>
                              <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat content area */}
        <div className="col-span-9 h-full flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="border-b p-3 flex items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center mr-3">
                    <span>{conversations.find(c => c.id === selectedChat)?.company.avatar}</span>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {conversations.find(c => c.id === selectedChat)?.company.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversations.find(c => c.id === selectedChat)?.company.isOnline 
                        ? "Online" 
                        : `Last seen ${conversations.find(c => c.id === selectedChat)?.company.lastSeen}`}
                    </p>
                  </div>
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Call</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Video className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Video call</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Info</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                      <DropdownMenuItem>Block company</DropdownMenuItem>
                      <DropdownMenuItem>Clear chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Chat messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "company" && (
                        <Avatar className="h-8 w-8 text-white bg-primary flex items-center justify-center mr-2 self-end">
                          <span>{conversations.find(c => c.id === selectedChat)?.company.avatar}</span>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Chat input */}
              <div className="border-t p-3">
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>
                        <Image className="h-4 w-4 mr-2" />
                        <span>Photo or Video</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="h-4 w-4 mr-2" />
                        <span>Document</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Map className="h-4 w-4 mr-2" />
                        <span>Location</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col p-6 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 