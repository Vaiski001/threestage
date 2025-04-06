import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Bell, 
  Plus, 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MoreHorizontal,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Static example content that can be rendered directly
const staticTeamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@company.com",
    role: "Admin",
    department: "Management",
    status: "Active",
    lastActive: "Just now"
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@company.com", 
    role: "Member",
    department: "Customer Support",
    status: "Active",
    lastActive: "3 hours ago"
  },
  {
    id: 3,
    name: "Mike Thompson",
    email: "mike@company.com",
    role: "Member",
    department: "Sales",
    status: "Inactive",
    lastActive: "2 days ago"
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa@company.com",
    role: "Member",
    department: "Marketing",
    status: "Pending",
    lastActive: "Never"
  }
];

export default function CompanyTeam() {
  // Check if we should force the use of static content
  if (window.location.search.includes('static=true')) {
    return (
      <AppLayout>
        <header className="h-16 border-b border-border flex items-center px-4">
          <h1 className="ml-4 text-lg font-semibold">Team Management</h1>
        </header>

        <main className="p-6">
          <Container>
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Team Management</h1>
                <p className="text-muted-foreground">Manage your company team members and roles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>4</CardTitle>
                    <CardDescription>Total Team Members</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>2</CardTitle>
                    <CardDescription>Active Team Members</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>2</CardTitle>
                    <CardDescription>Pending Invitations</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Company Team Members</CardTitle>
                  <CardDescription>Manage your team members and their access levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staticTeamMembers.map(member => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.status}</TableCell>
                          <TableCell>{member.lastActive}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </Container>
        </main>
      </AppLayout>
    );
  }
  
  // Original component continues here
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("members");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample team members data - in a real app, this would come from Supabase
  const sampleTeamMembers = [
    {
      id: "usr-001",
      name: "Alex Johnson",
      email: "alex@company.com",
      role: "Admin",
      status: "active",
      avatar: "/avatars/alex.jpg",
      department: "Management",
      lastActive: "Just now"
    },
    {
      id: "usr-002",
      name: "Sarah Williams",
      email: "sarah@company.com",
      role: "Member",
      status: "active",
      avatar: "/avatars/sarah.jpg", 
      department: "Customer Support",
      lastActive: "3 hours ago"
    },
    {
      id: "usr-003",
      name: "Mike Thompson",
      email: "mike@company.com",
      role: "Member",
      status: "inactive",
      avatar: "/avatars/mike.jpg",
      department: "Sales",
      lastActive: "2 days ago"
    },
    {
      id: "usr-004",
      name: "Lisa Chen",
      email: "lisa@company.com",
      role: "Member",
      status: "pending",
      avatar: "/avatars/lisa.jpg",
      department: "Marketing",
      lastActive: "Never"
    }
  ];
  
  // Sample pending invitations - in a real app, this would come from Supabase
  const samplePendingInvites = [
    {
      id: "inv-001",
      email: "john@example.com",
      role: "Member",
      department: "Engineering",
      sentAt: "Nov 15, 2023",
      status: "pending"
    },
    {
      id: "inv-002",
      email: "anna@example.com",
      role: "Member",
      department: "Customer Support",
      sentAt: "Nov 12, 2023",
      status: "pending"
    }
  ];
  
  // Load team data or use sample data in development/preview mode
  useEffect(() => {
    console.log("CompanyTeam: Setting up data...");
    
    // In development mode, immediately set the data
    if (import.meta.env.DEV) {
      console.log("CompanyTeam: In dev mode, setting data immediately");
      setTeamData({
        members: sampleTeamMembers,
        invites: samplePendingInvites
      });
      setIsLoading(false);
      return;
    }
    
    // For production, simulate API call delay
    const timer = setTimeout(() => {
      console.log("CompanyTeam: Timer complete, setting data");
      // In production, we would fetch real data from Supabase here
      setTeamData({
        members: sampleTeamMembers,
        invites: samplePendingInvites
      });
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use sample or real data
  const teamMembers = teamData?.members || [];
  const pendingInvites = teamData?.invites || [];
  
  const stats = [
    { 
      title: "Total Members", 
      value: "4", 
      description: "Active team members",
      icon: <Users className="h-5 w-5 text-primary" />
    },
    { 
      title: "Active Now", 
      value: "2", 
      description: "Currently online",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
    { 
      title: "Pending Invites", 
      value: "2", 
      description: "Awaiting acceptance",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />
    }
  ];

  const handleInviteTeamMember = () => {
    toast({
      title: "Invitation sent",
      description: "The team member has been invited to join your company."
    });
    setInviteDialogOpen(false);
  };

  const handleResendInvite = (id: string) => {
    toast({
      title: "Invitation resent",
      description: "The invitation has been resent successfully."
    });
  };

  const handleCancelInvite = (id: string) => {
    toast({
      title: "Invitation cancelled",
      description: "The invitation has been cancelled."
    });
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setDetailsOpen(true);
  };

  const handleEditMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      handleViewMember(member);
    } else {
      toast({
        title: "Team member not found",
        description: "Could not find team member details."
      });
    }
  };

  const handleRemoveMember = (id: string) => {
    toast({
      title: "Team member removed",
      description: "The team member has been removed from your company."
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400">Admin</Badge>;
      case "Member":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400">Member</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAvatarFallback = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Sample avatar images for development
  const devAvatars = {
    "Alex Johnson": "https://randomuser.me/api/portraits/men/32.jpg",
    "Sarah Williams": "https://randomuser.me/api/portraits/women/44.jpg",
    "Mike Thompson": "https://randomuser.me/api/portraits/men/67.jpg",
    "Lisa Chen": "https://randomuser.me/api/portraits/women/17.jpg",
  };

  const getAvatarSrc = (member) => {
    // In development, use randomuser.me images
    if (import.meta.env.DEV) {
      return devAvatars[member.name] || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`;
    }
    // In production, use the real avatar path
    return member.avatar;
  };

  // In case of render errors, show a fallback UI
  if (hasError) {
    return (
      <AppLayout>
        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="mb-4">
                  <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Team Management</h2>
                  <p className="text-muted-foreground mb-6">
                    We're having trouble displaying your team members.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Reload Page
                  </Button>
                </div>
                <div className="mt-8 w-full max-w-md bg-muted/20 rounded-lg p-6">
                  <h3 className="font-medium mb-2">Team members:</h3>
                  <ul className="space-y-2">
                    {sampleTeamMembers.map(member => (
                      <li key={member.id} className="p-2 rounded bg-card flex justify-between">
                        <span>{member.name}</span>
                        <span className="text-muted-foreground">{member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </div>
        </main>
      </AppLayout>
    );
  }

  // In the render code, handle loading state
  if (isLoading) {
    return (
      <AppLayout>
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Team Management</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full mb-4"></div>
                  <div className="h-6 w-48 bg-primary/10 rounded mb-2"></div>
                  <div className="h-4 w-64 bg-primary/10 rounded"></div>
                </div>
              </div>
            </Container>
          </div>
        </main>
      </AppLayout>
    );
  }

  try {
    return (
      <AppLayout>
        <div className="flex-1 overflow-y-auto">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Team Management</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to a new team member to join your company.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" placeholder="email@example.com" type="email" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name (Optional)</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue="member">
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Select defaultValue="support">
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="management">Management</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="support">Customer Support</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <textarea 
                        id="message" 
                        placeholder="Enter a personal message to include in the invitation email" 
                        className="min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleInviteTeamMember}>
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">Team Management</h2>
                  <p className="text-muted-foreground">Manage your company team members and roles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardDescription>{stat.description}</CardDescription>
                        <CardTitle className="text-2xl">{stat.value}</CardTitle>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="members">
                    <Users className="h-4 w-4 mr-2" />
                    Team Members
                  </TabsTrigger>
                  <TabsTrigger value="invitations">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Pending Invitations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Company Team Members</CardTitle>
                        <div className="flex gap-2">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <CardDescription>
                        Manage your team members and their access levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Member</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Active</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamMembers.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={getAvatarSrc(member)} alt={member.name} />
                                      <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{member.name}</div>
                                      <div className="text-sm text-muted-foreground">{member.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{member.department}</TableCell>
                                <TableCell>{getRoleBadge(member.role)}</TableCell>
                                <TableCell>{getStatusBadge(member.status)}</TableCell>
                                <TableCell>{member.lastActive}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewMember(member)}
                                    >
                                      View
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Open menu</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleViewMember(member)}>
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          onClick={() => handleRemoveMember(member.id)}
                                          className="text-destructive"
                                        >
                                          Remove
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t p-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {teamMembers.length} team members
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="invitations" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Pending Invitations</CardTitle>
                      </div>
                      <CardDescription>
                        Manage invitations that have been sent to new team members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingInvites.length === 0 ? (
                        <div className="text-center py-8">
                          <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No pending invitations</h3>
                          <p className="text-muted-foreground mb-4">
                            There are no pending invitations to your company.
                          </p>
                          <Button onClick={() => setInviteDialogOpen(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite Team Member
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[300px]">Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Sent On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pendingInvites.map((invite) => (
                                <TableRow key={invite.id}>
                                  <TableCell className="font-medium">{invite.email}</TableCell>
                                  <TableCell>{invite.role}</TableCell>
                                  <TableCell>{invite.department}</TableCell>
                                  <TableCell>{invite.sentAt}</TableCell>
                                  <TableCell>{getStatusBadge(invite.status)}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleResendInvite(invite.id)}
                                      >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Resend
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-destructive hover:text-destructive" 
                                        onClick={() => handleCancelInvite(invite.id)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Container>
          </main>
        </div>

        {/* Team Member Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          {selectedMember && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Team Member Details</DialogTitle>
                <DialogDescription>
                  View and manage team member information
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={getAvatarSrc(selectedMember)} alt={selectedMember.name} />
                    <AvatarFallback className="text-xl">{getAvatarFallback(selectedMember.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{selectedMember.name}</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">{selectedMember.department}</p>
                      <span>•</span>
                      {getRoleBadge(selectedMember.role)}
                      <span>•</span>
                      {getStatusBadge(selectedMember.status)}
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <div className="mt-1">{selectedMember.email}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Active</Label>
                      <div className="mt-1">{selectedMember.lastActive}</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Permissions</Label>
                    <div className="mt-1 space-y-2">
                      {selectedMember.role === "Admin" ? (
                        <div className="text-sm">
                          <p>Full access to all features including:</p>
                          <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                            <li>Team management</li>
                            <li>Billing and subscriptions</li>
                            <li>Company settings</li>
                            <li>Customer data access</li>
                          </ul>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p>Standard team member access:</p>
                          <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                            <li>View and respond to enquiries</li>
                            <li>Limited customer data access</li>
                            <li>View company reports</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Recent Activity</Label>
                    <div className="mt-1 space-y-1">
                      {[
                        { date: "Today", action: "Responded to 2 customer enquiries" },
                        { date: "Yesterday", action: "Updated customer records" },
                        { date: "3 days ago", action: "Generated monthly report" }
                      ].map((activity, i) => (
                        <div key={i} className="flex justify-between text-sm p-2 rounded-md bg-muted/50">
                          <span>{activity.action}</span>
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button>
                  Edit Member
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </AppLayout>
    );
  } catch (error) {
    console.error("Error rendering CompanyTeam:", error);
    setHasError(true);
    return null;
  }
}

// Simple fallback component that can be used directly if the main component has issues
export function TeamManagementFallback() {
  return (
    <AppLayout>
      <header className="h-16 border-b border-border flex items-center px-4">
        <h1 className="ml-4 text-lg font-semibold">Team Management</h1>
      </header>

      <main className="p-6">
        <Container>
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Team Management</h1>
              <p className="text-muted-foreground">Manage your company team members and roles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>4</CardTitle>
                  <CardDescription>Total Team Members</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2</CardTitle>
                  <CardDescription>Active Team Members</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2</CardTitle>
                  <CardDescription>Pending Invitations</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Company Team Members</CardTitle>
                <CardDescription>Manage your team members and their access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Alex Johnson</TableCell>
                      <TableCell>Management</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sarah Williams</TableCell>
                      <TableCell>Customer Support</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mike Thompson</TableCell>
                      <TableCell>Sales</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Inactive</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lisa Chen</TableCell>
                      <TableCell>Marketing</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Pending</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
    </AppLayout>
  );
} 