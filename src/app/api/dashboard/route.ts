import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

// Helper function to verify the session
async function verifySession(request: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('threestage-auth');
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is valid (not expired)
    if (!session || new Date(session.expires_at * 1000) < new Date()) {
      return null;
    }
    
    return {
      user: session.user,
      role: session.user?.user_metadata?.role || 'customer'
    };
  } catch (error) {
    console.error('Session parse error:', error);
    return null;
  }
}

// GET request handler for dashboard data
export async function GET(request: NextRequest) {
  // Verify user session
  const authData = await verifySession(request);
  
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Initialize Supabase client
  const supabase = createClient(
    supabaseUrl!,
    supabaseServiceKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  
  // For development, return mock data
  if (process.env.NODE_ENV === 'development') {
    if (authData.role === 'customer') {
      return NextResponse.json({
        enquiries: {
          active: 3,
          pending: 2,
          completed: 12,
          lastCompletedDate: '2023-04-03T14:43:12Z'
        },
        messages: {
          total: 5,
          unread: 2
        },
        activities: [
          { id: '1', action: 'Message received', date: '2 hours ago', description: 'RE: Product inquiry #1234' },
          { id: '2', action: 'Status updated', date: '1 day ago', description: 'Enquiry #2345 marked as In Progress' },
          { id: '3', action: 'New enquiry created', date: '3 days ago', description: 'Enquiry #3456 submitted successfully' },
          { id: '4', action: 'Message sent', date: '5 days ago', description: 'RE: Support request #4567' }
        ]
      });
    } else {
      return NextResponse.json({
        enquiries: { total: 24, needAttention: 8 },
        customers: { total: 156, newThisMonth: 12 },
        messages: { total: 38, unread: 5 },
        team: { responseRate: 92 },
        recentEnquiries: [
          { id: 'EN5423', customer: 'Jane Cooper', subject: 'Product information request', status: 'New', date: '2 hours ago' },
          { id: 'EN5419', customer: 'Robert Fox', subject: 'Service cancellation', status: 'Pending', date: '5 hours ago' },
          { id: 'EN5412', customer: 'Leslie Alexander', subject: 'Billing inquiry', status: 'In Progress', date: '1 day ago' },
          { id: 'EN5410', customer: 'Kristin Watson', subject: 'Technical support', status: 'New', date: '1 day ago' },
          { id: 'EN5405', customer: 'Guy Hawkins', subject: 'Custom integration', status: 'Completed', date: '2 days ago' }
        ],
        recentCustomers: [
          { id: 'CUS1234', name: 'Jane Cooper', email: 'jane@example.com', joinedDate: '2 days ago', enquiryCount: 3 },
          { id: 'CUS1235', name: 'Robert Fox', email: 'robert@example.com', joinedDate: '5 days ago', enquiryCount: 1 },
          { id: 'CUS1236', name: 'Leslie Alexander', email: 'leslie@example.com', joinedDate: '1 week ago', enquiryCount: 4 }
        ],
        teamPerformance: [
          { member: 'Sarah Johnson', responseTime: '1.5 hours', resolvedCount: 45, satisfactionRate: 96 },
          { member: 'Michael Brown', responseTime: '2.1 hours', resolvedCount: 38, satisfactionRate: 94 },
          { member: 'Emily Davis', responseTime: '1.2 hours', resolvedCount: 52, satisfactionRate: 97 }
        ]
      });
    }
  }
  
  try {
    // Different data based on user role
    if (authData.role === 'customer') {
      // Get customer data
      const userId = authData.user.id;
      
      // Fetch active enquiries
      const { data: activeEnquiries, error: enquiriesError } = await supabase
        .from('enquiries')
        .select('id, status')
        .eq('customer_id', userId)
        .neq('status', 'completed');
      
      if (enquiriesError) throw enquiriesError;
      
      // Fetch completed enquiries
      const { data: completedEnquiries, error: completedError } = await supabase
        .from('enquiries')
        .select('id, updated_at')
        .eq('customer_id', userId)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (completedError) throw completedError;
      
      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, read')
        .eq('recipient_id', userId);
      
      if (messagesError) throw messagesError;
      
      // Fetch recent activity
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('id, action, description, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (activitiesError) throw activitiesError;
      
      // Count enquiries by status
      const activeCount = activeEnquiries?.length || 0;
      const pendingCount = activeEnquiries?.filter(e => e.status === 'pending').length || 0;
      const completedCount = completedEnquiries?.length || 0;
      const lastCompletedDate = completedEnquiries?.length ? completedEnquiries[0].updated_at : null;
      
      // Count messages
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter(m => !m.read).length || 0;
      
      // Format activities
      const formattedActivities = activities?.map(a => {
        // Calculate relative time
        const created = new Date(a.created_at);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        let date;
        if (diffDays > 0) {
          date = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
          date = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        return {
          id: a.id,
          action: a.action,
          description: a.description,
          date
        };
      }) || [];
      
      return NextResponse.json({
        enquiries: {
          active: activeCount,
          pending: pendingCount,
          completed: completedCount,
          lastCompletedDate
        },
        messages: {
          total: totalMessages,
          unread: unreadMessages
        },
        activities: formattedActivities
      });
    } else if (authData.role === 'company') {
      // Get company dashboard data
      
      // Fetch all enquiries
      const { data: enquiries, error: enquiriesError } = await supabase
        .from('enquiries')
        .select('id, status, customer_id, subject, created_at')
        .order('created_at', { ascending: false });
      
      if (enquiriesError) throw enquiriesError;
      
      // Fetch customers
      const { data: customers, error: customersError } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;
      
      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, read');
      
      if (messagesError) throw messagesError;
      
      // Fetch team performance (simplified)
      const { data: teamMembers, error: teamError } = await supabase
        .from('profiles')
        .select('id, email, user_metadata')
        .eq('role', 'company');
      
      if (teamError) throw teamError;
      
      // Count enquiries by status
      const totalEnquiries = enquiries?.length || 0;
      const needAttention = enquiries?.filter(e => e.status === 'new' || e.status === 'pending').length || 0;
      
      // Count customers
      const totalCustomers = customers?.length || 0;
      
      // Count new customers this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const newCustomersThisMonth = customers?.filter(c => {
        const created = new Date(c.created_at);
        return created >= startOfMonth;
      }).length || 0;
      
      // Count messages
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter(m => !m.read).length || 0;
      
      // Format recent enquiries
      const recentEnquiries = enquiries?.slice(0, 5).map(e => {
        // Calculate relative time
        const created = new Date(e.created_at);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        let date;
        if (diffDays > 0) {
          date = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
          date = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        // Find customer
        const customer = customers?.find(c => c.id === e.customer_id);
        
        // Format status to match the interface
        let status = e.status;
        if (status === 'new') status = 'New';
        else if (status === 'pending') status = 'Pending';
        else if (status === 'in_progress') status = 'In Progress';
        else if (status === 'completed') status = 'Completed';
        
        return {
          id: e.id,
          customer: customer?.email.split('@')[0] || 'Unknown',
          subject: e.subject,
          status: status as 'New' | 'Pending' | 'In Progress' | 'Completed',
          date
        };
      }) || [];
      
      // Format recent customers
      const recentCustomers = customers?.slice(0, 3).map(c => {
        // Calculate relative time
        const created = new Date(c.created_at);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        let joinedDate;
        if (diffDays > 7) {
          const diffWeeks = Math.floor(diffDays / 7);
          joinedDate = `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
        } else {
          joinedDate = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }
        
        // Count customer enquiries
        const customerEnquiryCount = enquiries?.filter(e => e.customer_id === c.id).length || 0;
        
        return {
          id: c.id,
          name: c.email.split('@')[0],
          email: c.email,
          joinedDate,
          enquiryCount: customerEnquiryCount
        };
      }) || [];
      
      // Mock team performance (since this would usually be calculated)
      const teamPerformance = [
        { member: 'Sarah Johnson', responseTime: '1.5 hours', resolvedCount: 45, satisfactionRate: 96 },
        { member: 'Michael Brown', responseTime: '2.1 hours', resolvedCount: 38, satisfactionRate: 94 },
        { member: 'Emily Davis', responseTime: '1.2 hours', resolvedCount: 52, satisfactionRate: 97 }
      ];
      
      return NextResponse.json({
        enquiries: { 
          total: totalEnquiries, 
          needAttention 
        },
        customers: { 
          total: totalCustomers, 
          newThisMonth: newCustomersThisMonth 
        },
        messages: { 
          total: totalMessages, 
          unread: unreadMessages 
        },
        team: { 
          responseRate: 92  // Mock data for now
        },
        recentEnquiries,
        recentCustomers,
        teamPerformance
      });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
} 